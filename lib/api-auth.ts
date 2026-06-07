import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { AuthRole, verifyAccessToken, COOKIE_NAME } from "@/lib/auth";

export function getAuthToken(request: NextRequest) {
  // 1. Coba ambil dari header Authorization
  const authHeader = request.headers.get("authorization") || "";
  if (authHeader.toLowerCase().startsWith("bearer ")) {
    return authHeader.slice(7).trim();
  }

  // 2. Coba ambil dari cookie
  const cookieToken = request.cookies.get(COOKIE_NAME)?.value;
  if (cookieToken) {
    return cookieToken;
  }

  return null;
}

export async function getCurrentUser(request: NextRequest) {
  const token = getAuthToken(request);
  if (!token) {
    return null;
  }

  try {
    // Verifikasi tanda tangan JWT
    const payload = verifyAccessToken(token);

    // Cek di database apakah sesi ini valid dan terdaftar
    const dbSession = await prisma.session.findUnique({
      where: { token },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            name: true,
          },
        },
      },
    });

    // Validasi apakah sesi ada, cocok dengan payload, dan belum kedaluwarsa
    if (!dbSession || dbSession.userId !== payload.sub || dbSession.expiresAt < new Date()) {
      return null;
    }

    return dbSession.user;
  } catch {
    return null;
  }
}

export async function requireAuth(request: NextRequest, allowedRoles?: AuthRole[]) {
  const user = await getCurrentUser(request);
  if (!user) {
    return { error: "Unauthorized", status: 401 as const, user: null };
  }

  if (allowedRoles && !allowedRoles.includes(user.role as AuthRole)) {
    return { error: "Forbidden", status: 403 as const, user: null };
  }

  return { error: null, status: 200 as const, user };
}
import { NextResponse, NextRequest } from "next/server";
import { verifyAccessToken, COOKIE_NAME } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    // Cari token di body, header, atau cookie
    let token: string | null = null;
    
    try {
      const body = await request.json();
      token = body?.token as string || null;
    } catch {
      // Body empty or not json, ignore
    }

    if (!token) {
      // Coba cari dari Authorization header
      const authHeader = request.headers.get("authorization") || "";
      if (authHeader.toLowerCase().startsWith("bearer ")) {
        token = authHeader.slice(7).trim();
      }
    }

    if (!token) {
      // Coba cari dari cookies
      token = request.cookies.get(COOKIE_NAME)?.value || null;
    }

    if (!token) {
      return NextResponse.json(
        { error: "Token wajib diisi." },
        { status: 400 }
      );
    }

    try {
      const payload = verifyAccessToken(token);
      
      // Cocokkan dengan database session
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

      if (!dbSession || dbSession.userId !== payload.sub || dbSession.expiresAt < new Date()) {
        const response = NextResponse.json(
          { error: "Sesi tidak valid atau telah berakhir." },
          { status: 401 }
        );
        response.cookies.delete(COOKIE_NAME);
        return response;
      }

      return NextResponse.json({
        ok: true,
        userId: dbSession.user.id,
        email: dbSession.user.email,
        role: dbSession.user.role,
        name: dbSession.user.name,
      });
    } catch {
      const response = NextResponse.json(
        { error: "Token tidak valid atau sudah expired." },
        { status: 401 }
      );
      response.cookies.delete(COOKIE_NAME);
      return response;
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal verifikasi token.";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
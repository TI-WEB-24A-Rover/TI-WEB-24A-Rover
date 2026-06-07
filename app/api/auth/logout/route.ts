import { NextResponse, NextRequest } from "next/server";
import { getAuthToken } from "@/lib/api-auth";
import { COOKIE_NAME } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const token = getAuthToken(request);

    if (token) {
      // Delete session from database if exists
      try {
        await prisma.session.delete({
          where: { token },
        });
      } catch {
        // Session might not exist in db, ignore
      }
    }

    const response = NextResponse.json({
      ok: true,
      message: "Logout berhasil.",
    });

    // Clear the auth_token cookie
    response.cookies.delete(COOKIE_NAME);

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal melakukan logout.";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

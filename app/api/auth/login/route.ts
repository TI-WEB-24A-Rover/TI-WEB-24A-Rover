import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { generateAccessToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email dan password wajib diisi." },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Email atau password salah." },
        { status: 401 }
      );
    }

    // Verify password
    let isValid = false;
    try {
      isValid = await bcrypt.compare(password, user.passwordHash);
    } catch {
      // If bcrypt compare fails, it might be due to a malformed hash or plain text seed password
      isValid = false;
    }

    // Fallback comparison for unhashed seed passwords (like 'seed-password')
    if (!isValid && user.passwordHash === password) {
      isValid = true;
    }

    if (!isValid) {
      return NextResponse.json(
        { error: "Email atau password salah." },
        { status: 401 }
      );
    }

    // Generate token
    const token = generateAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    // Save session in database
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await prisma.session.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    });

    const response = NextResponse.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
    });

    // Import cookie name and options
    const { COOKIE_NAME, COOKIE_OPTIONS } = await import("@/lib/auth");
    response.cookies.set(COOKIE_NAME, token, COOKIE_OPTIONS);

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal melakukan login.";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}


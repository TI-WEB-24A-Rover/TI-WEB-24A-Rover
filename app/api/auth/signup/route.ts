import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { generateAccessToken, COOKIE_NAME, COOKIE_OPTIONS } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, role, phone, gender, birthDate, image } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: "Nama, email, password, dan role wajib diisi." },
        { status: 400 }
      );
    }

    if (role !== "CUSTOMER" && role !== "FARMER" && role !== "ADMIN") {
      return NextResponse.json(
        { error: "Role tidak valid." },
        { status: 400 }
      );
    }

    const emailTrimmed = email.trim().toLowerCase();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: emailTrimmed },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email sudah terdaftar." },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: emailTrimmed,
        passwordHash,
        role,
        phone: phone || null,
        gender: gender || null,
        birthDate: birthDate ? new Date(birthDate) : null,
        image: image || null,
      },
    });

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

    // Set cookie
    response.cookies.set(COOKIE_NAME, token, COOKIE_OPTIONS);

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal melakukan registrasi.";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

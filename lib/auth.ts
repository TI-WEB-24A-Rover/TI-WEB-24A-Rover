import jwt from "jsonwebtoken";

export type AuthRole = "ADMIN" | "CUSTOMER" | "FARMER";

export interface TokenPayload {
  sub: string;
  email: string;
  role: AuthRole;
}

const JWT_SECRET = process.env.JWT_SECRET || "infotani-super-secret-change-this";

export function generateAccessToken(payload: { sub: string; email: string; role: AuthRole }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
}

export const COOKIE_NAME = "auth_token";

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 7 * 24 * 60 * 60, // 7 days
};


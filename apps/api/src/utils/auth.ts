import jwt from "jsonwebtoken";
import { AuthUser } from "../types.js";

const secret = process.env.JWT_SECRET || "change-me";

export function signToken(user: AuthUser) {
  return jwt.sign(user, secret, { expiresIn: "8h" });
}

export function verifyToken(token: string): AuthUser {
  return jwt.verify(token, secret) as AuthUser;
}

import { NextFunction, Request, Response } from "express";
import { Role } from "@prisma/client";
import { verifyToken } from "../utils/auth.js";
import { AuthUser } from "../types.js";

export interface RequestWithUser extends Request {
  user?: AuthUser;
}

export function requireAuth(req: RequestWithUser, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) return res.status(401).json({ error: "Unauthorized" });
  try {
    req.user = verifyToken(auth.slice(7));
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

export function requireRole(...roles: Role[]) {
  return (req: RequestWithUser, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  };
}

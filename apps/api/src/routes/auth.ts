import { Router } from "express";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";
import { z } from "zod";
import { prisma } from "../db.js";
import { signToken } from "../utils/auth.js";

const router = Router();
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
  role: z.nativeEnum(Role).optional()
});

router.post("/register", async (req, res) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());
  const { email, password, name, role } = parsed.data;
  const passwordHash = await bcrypt.hash(String(password), 10);
  const user = await prisma.user.create({
    data: { email, passwordHash, name: name || "New User", role: role || Role.ANALYST }
  });
  const token = signToken({ id: user.id, email: user.email, role: user.role });
  res.json({ token, user: { id: user.id, email: user.email, role: user.role, name: user.name } });
});

router.post("/login", async (req, res) => {
  const parsed = schema.pick({ email: true, password: true }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());
  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return res.status(401).json({ error: "Invalid credentials" });
  const token = signToken({ id: user.id, email: user.email, role: user.role });
  res.json({ token, user: { id: user.id, email: user.email, role: user.role, name: user.name } });
});

export default router;

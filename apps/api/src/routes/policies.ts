import { Router } from "express";
import { z } from "zod";
import { PolicyAction } from "@prisma/client";
import { prisma } from "../db.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { evaluatePolicies } from "../utils/policy.js";
import { inspectText } from "../utils/detectors.js";

const router = Router();
const schema = z.object({
  name: z.string().min(3),
  condition: z.string().min(2),
  action: z.nativeEnum(PolicyAction),
  priority: z.number().int().min(1).max(999),
  enabled: z.boolean()
});

router.get("/", requireAuth, async (_req, res) => {
  const policies = await prisma.policyRule.findMany({ orderBy: { priority: "asc" } });
  res.json(policies);
});

router.post("/", requireAuth, requireRole("ADMIN"), async (req, res) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const policy = await prisma.policyRule.create({ data: parsed.data });
  res.json(policy);
});

router.put("/:id", requireAuth, requireRole("ADMIN"), async (req, res) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const policy = await prisma.policyRule.update({ where: { id: req.params.id }, data: parsed.data });
  res.json(policy);
});

router.delete("/:id", requireAuth, requireRole("ADMIN"), async (req, res) => {
  await prisma.policyRule.delete({ where: { id: req.params.id } });
  res.json({ ok: true });
});

router.post("/simulate", requireAuth, async (req, res) => {
  const input = String(req.body?.input || "");
  const declaredIntent = String(req.body?.declaredIntent || "");
  const rules = await prisma.policyRule.findMany();
  const decision = evaluatePolicies(input, rules);
  const risk = inspectText(input, declaredIntent);
  res.json({ decision, risk });
});

export default router;

import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { prisma } from "../db.js";

const router = Router();

router.get("/", requireAuth, requireRole("ADMIN", "AUDITOR"), async (req, res) => {
  const outcome = req.query.outcome?.toString();
  const minRisk = Number(req.query.minRisk || 0);
  const logs = await prisma.auditLog.findMany({
    where: {
      outcome: outcome || undefined,
      riskScore: { gte: Number.isNaN(minRisk) ? 0 : minRisk }
    },
    orderBy: { createdAt: "desc" },
    take: 200
  });
  res.json(logs);
});

router.get("/export", requireAuth, requireRole("ADMIN", "AUDITOR"), async (_req, res) => {
  const logs = await prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 500 });
  const headers = ["id", "action", "resource", "outcome", "riskScore", "createdAt"];
  const csv = [headers.join(",")]
    .concat(logs.map((l: any) => [l.id, l.action, l.resource, l.outcome, l.riskScore, l.createdAt.toISOString()].join(",")))
    .join("\n");
  res.setHeader("Content-Type", "text/csv");
  res.send(csv);
});

export default router;

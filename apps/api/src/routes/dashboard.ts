import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { prisma } from "../db.js";

const router = Router();

router.get("/stats", requireAuth, async (_req, res) => {
  const [total, blocked, humanReview, topRisk] = await Promise.all([
    prisma.workflow.count(),
    prisma.workflow.count({ where: { decision: { in: ["DENY", "QUARANTINE"] } } }),
    prisma.workflow.count({ where: { decision: "HUMAN_REVIEW" } }),
    prisma.riskFinding.groupBy({ by: ["category"], _count: true, orderBy: { _count: { category: "desc" } }, take: 5 })
  ]);

  res.json({
    totalRequests: total,
    blockedRequests: blocked,
    humanReviewQueue: humanReview,
    topRiskCategories: topRisk.map((r: any) => ({ category: r.category, count: r._count }))
  });
});

router.get("/metrics", async (_req, res) => {
  res.type("text/plain").send("sentinelops_api_up 1\n");
});

export default router;

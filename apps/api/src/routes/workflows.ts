import { Router } from "express";
import { z } from "zod";
import { PolicyAction } from "@prisma/client";
import { prisma } from "../db.js";
import { requireAuth, RequestWithUser } from "../middleware/auth.js";
import { inspectText } from "../utils/detectors.js";
import { evaluatePolicies } from "../utils/policy.js";
import { runModel } from "../utils/ai.js";

const router = Router();
const createSchema = z.object({
  title: z.string().min(3),
  input: z.string().min(3),
  declaredIntent: z.string().optional()
});

router.post("/", requireAuth, async (req: RequestWithUser, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success || !req.user) return res.status(400).json({ error: "Invalid payload" });

  const { title, input, declaredIntent } = parsed.data;
  const risk = inspectText(input, declaredIntent);
  const rules = await prisma.policyRule.findMany();
  const decision = evaluatePolicies(input, rules);

  const workflow = await prisma.workflow.create({
    data: {
      title,
      input,
      declaredIntent,
      detectedIntent: risk.detectedIntent,
      riskScore: risk.score,
      decision: decision.action,
      userId: req.user.id
    }
  });

  const stages = [
    ["input_received", "Input accepted"],
    ["inspection_complete", `Risk score ${risk.score}`],
    ["policy_complete", `Policy action ${decision.action}`]
  ];
  for (const [stage, message] of stages) {
    await prisma.workflowEvent.create({ data: { workflowId: workflow.id, stage, message } });
  }

  for (const reason of risk.reasons) {
    await prisma.riskFinding.create({ data: { workflowId: workflow.id, category: reason.split(":")[0], detail: reason, score: risk.score } });
  }

  let modelResponse: string | null = null;
  if (decision.action === PolicyAction.ALLOW || decision.action === PolicyAction.RATE_LIMIT) {
    modelResponse = await runModel(input);
    await prisma.workflowEvent.create({ data: { workflowId: workflow.id, stage: "model_response", message: "Model responded successfully" } });
  } else {
    await prisma.workflowEvent.create({ data: { workflowId: workflow.id, stage: "blocked", message: `Workflow blocked: ${decision.action}` } });
  }

  const updated = await prisma.workflow.update({
    where: { id: workflow.id },
    data: { modelResponse },
    include: { events: true, findings: true }
  });

  await prisma.auditLog.create({
    data: {
      userId: req.user.id,
      action: "workflow.create",
      resource: workflow.id,
      outcome: decision.action,
      riskScore: risk.score,
      metadata: { declaredIntent, detectedIntent: risk.detectedIntent, matchedRule: decision.matchedRule }
    }
  });

  res.json(updated);
});

router.get("/", requireAuth, async (_req, res) => {
  const items = await prisma.workflow.findMany({ orderBy: { createdAt: "desc" }, take: 50 });
  res.json(items);
});

router.get("/:id", requireAuth, async (req, res) => {
  const item = await prisma.workflow.findUnique({
    where: { id: req.params.id },
    include: { events: true, findings: true, user: { select: { email: true, role: true } } }
  });
  if (!item) return res.status(404).json({ error: "Not found" });
  res.json(item);
});

router.get("/:id/events", requireAuth, async (req, res) => {
  const events = await prisma.workflowEvent.findMany({ where: { workflowId: req.params.id }, orderBy: { createdAt: "asc" } });
  res.json(events);
});

export default router;

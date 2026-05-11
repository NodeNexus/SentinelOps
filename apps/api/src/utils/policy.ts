import { PolicyAction, PolicyRule } from "@prisma/client";
import { PolicyDecision } from "../types.js";

export function evaluatePolicies(input: string, rules: PolicyRule[]): PolicyDecision {
  const sorted = [...rules].filter((r) => r.enabled).sort((a, b) => a.priority - b.priority);
  for (const rule of sorted) {
    const regex = new RegExp(rule.condition, "i");
    if (regex.test(input)) {
      return { action: rule.action, matchedRule: rule.name };
    }
  }
  return { action: PolicyAction.ALLOW };
}

import { RiskResult } from "../types.js";

const rules = [
  { category: "prompt_injection", regex: /(ignore previous|system prompt|jailbreak|override instructions)/i, score: 35, intent: "Prompt Manipulation" },
  { category: "exfiltration", regex: /(export|send|upload).*(secret|password|token|credential)/i, score: 40, intent: "Data Exfiltration" },
  { category: "credential_leak", regex: /(api[_-]?key|password|private key|access token)/i, score: 25, intent: "Sensitive Data Handling" },
  { category: "unsafe_command", regex: /(rm -rf|drop database|shutdown|sudo|powershell)/i, score: 20, intent: "Potentially Unsafe Action" }
];

export function inspectText(input: string, declaredIntent?: string): RiskResult {
  let score = 0;
  const reasons: string[] = [];
  let detectedIntent = "General Task Automation";

  for (const rule of rules) {
    if (rule.regex.test(input)) {
      score += rule.score;
      reasons.push(`${rule.category}: matched "${rule.regex.source}"`);
      detectedIntent = rule.intent;
    }
  }

  if (declaredIntent && detectedIntent !== "General Task Automation" && !declaredIntent.toLowerCase().includes(detectedIntent.toLowerCase().split(" ")[0])) {
    score += 10;
    reasons.push("declared_vs_detected_intent_mismatch");
  }

  return { score: Math.min(100, score), reasons, detectedIntent };
}

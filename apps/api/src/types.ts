import { PolicyAction, Role } from "@prisma/client";

export type AuthUser = {
  id: string;
  email: string;
  role: Role;
};

export type RiskResult = {
  score: number;
  reasons: string[];
  detectedIntent: string;
};

export type PolicyDecision = {
  action: PolicyAction;
  matchedRule?: string;
};

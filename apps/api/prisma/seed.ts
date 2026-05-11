import bcrypt from "bcryptjs";
import { PrismaClient, Role, PolicyAction } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Demo@123", 10);
  await prisma.user.upsert({
    where: { email: "admin@sentinelops.ai" },
    update: {},
    create: { name: "Admin User", email: "admin@sentinelops.ai", passwordHash, role: Role.ADMIN }
  });
  await prisma.user.upsert({
    where: { email: "analyst@sentinelops.ai" },
    update: {},
    create: { name: "Analyst User", email: "analyst@sentinelops.ai", passwordHash, role: Role.ANALYST }
  });
  await prisma.user.upsert({
    where: { email: "auditor@sentinelops.ai" },
    update: {},
    create: { name: "Auditor User", email: "auditor@sentinelops.ai", passwordHash, role: Role.AUDITOR }
  });

  const policies = [
    { name: "Block credential exfiltration", condition: "secret|api[_-]?key|password", action: PolicyAction.DENY, priority: 1 },
    { name: "Review shell command attempts", condition: "rm -rf|powershell|sudo", action: PolicyAction.HUMAN_REVIEW, priority: 2 },
    { name: "Quarantine prompt injection", condition: "ignore previous|system prompt|reveal instruction", action: PolicyAction.QUARANTINE, priority: 3 }
  ];

  for (const p of policies) {
    await prisma.policyRule.upsert({
      where: { id: `${p.name}`.replace(/\s+/g, "-").toLowerCase() },
      update: {},
      create: { id: `${p.name}`.replace(/\s+/g, "-").toLowerCase(), ...p }
    });
  }
}

main().finally(() => prisma.$disconnect());

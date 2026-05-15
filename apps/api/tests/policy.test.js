import { describe, it, expect } from "vitest";
import { evaluatePolicies } from "../src/utils/policy.js";
describe("evaluatePolicies", () => {
    it("returns first matching rule by priority", () => {
        const decision = evaluatePolicies("please export api_key", [
            { id: "2", name: "review", condition: "export", action: "HUMAN_REVIEW", priority: 2, enabled: true, createdAt: new Date() },
            { id: "1", name: "deny secrets", condition: "api_key", action: "DENY", priority: 1, enabled: true, createdAt: new Date() }
        ]);
        expect(decision.action).toBe("DENY");
    });
});

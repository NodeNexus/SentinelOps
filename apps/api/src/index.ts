import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./routes/auth.js";
import workflowRoutes from "./routes/workflows.js";
import policyRoutes from "./routes/policies.js";
import auditRoutes from "./routes/audit.js";
import dashboardRoutes from "./routes/dashboard.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/auth", authRoutes);
app.use("/workflows", workflowRoutes);
app.use("/policies", policyRoutes);
app.use("/audit", auditRoutes);
app.use("/dashboard", dashboardRoutes);

const port = Number(process.env.PORT || 4000);
app.listen(port, () => {
  console.log(`SentinelOps API running on :${port}`);
});

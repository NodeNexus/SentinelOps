"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "../../../lib/api";

type WorkflowDetail = {
  id: string;
  title: string;
  decision: string;
  riskScore: number;
  input: string;
  modelResponse: string | null;
  declaredIntent?: string;
  detectedIntent?: string;
  createdAt: string;
  user?: { email: string; role: string };
  events: { id: string; stage: string; message: string; createdAt: string }[];
  findings: { id: string; category: string; detail: string; score: number }[];
};

function DecisionBadge({ decision }: { decision: string }) {
  const d = decision?.toUpperCase();
  if (d === "DENY" || d === "BLOCK")  return <span className="badge badge-red text-sm py-1 px-3">🚫 {d}</span>;
  if (d === "ALLOW")                   return <span className="badge badge-green text-sm py-1 px-3">✓ {d}</span>;
  if (d === "HUMAN_REVIEW")           return <span className="badge badge-amber text-sm py-1 px-3">⧗ Human Review</span>;
  if (d === "QUARANTINE")             return <span className="badge badge-purple text-sm py-1 px-3">⬡ Quarantined</span>;
  return <span className="badge badge-gray text-sm py-1 px-3">{decision}</span>;
}

const stageIcons: Record<string, string> = {
  input_received:      "📥",
  inspection_complete: "🔍",
  policy_complete:     "📋",
  model_response:      "🤖",
  blocked:             "🚫",
};

export default function WorkflowDetail({ params }: { params: { id: string } }) {
  const [data, setData] = useState<WorkflowDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(false);

  useEffect(() => {
    apiFetch(`/workflows/${params.id}`)
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, [params.id]);

  if (loading) {
    return (
      <main className="relative z-10 py-10">
        <div className="container space-y-6">
          <div className="skeleton h-8 w-64 rounded" />
          <div className="grid md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <div key={i} className="stat-card"><div className="skeleton h-20 w-full rounded" /></div>)}
          </div>
        </div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="relative z-10 py-10">
        <div className="container">
          <div className="glass-card p-10 text-center">
            <div className="text-4xl mb-3">⚠️</div>
            <p className="text-slate-400 font-semibold">Workflow not found or you are not authorized.</p>
            <Link href="/workflows" className="btn-secondary mt-6 inline-flex">← Back to Workflows</Link>
          </div>
        </div>
      </main>
    );
  }

  const riskPct   = Math.min(100, data.riskScore);
  const riskColor = riskPct >= 70 ? "#f43f5e" : riskPct >= 40 ? "#f59e0b" : "#10b981";

  return (
    <main className="relative z-10 py-10">
      <div className="container space-y-6">

        {/* Breadcrumb + Header */}
        <div className="animate-fade-in-up">
          <Link href="/workflows" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-cyan-400 transition-colors mb-3">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            All Workflows
          </Link>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-black text-white">{data.title}</h1>
              <p className="text-xs text-slate-500 mt-1">
                {new Date(data.createdAt).toLocaleString()} · by {data.user?.email || "unknown"}
              </p>
            </div>
            <DecisionBadge decision={data.decision} />
          </div>
        </div>

        {/* Stat row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in-up delay-100">
          {[
            { label: "Risk Score",       value: data.riskScore,          color: riskColor,  suffix: "/100" },
            { label: "Decision",         value: data.decision,           color: "#94a3b8",  suffix: "" },
            { label: "Declared Intent",  value: data.declaredIntent || "—", color: "#94a3b8", suffix: "" },
            { label: "Detected Intent",  value: data.detectedIntent || "—", color: "#94a3b8", suffix: "" },
          ].map(({ label, value, color, suffix }) => (
            <div key={label} className="stat-card">
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">{label}</p>
              <p className="text-xl font-black truncate" style={{ color }}>{value}<span className="text-sm font-normal text-slate-600">{suffix}</span></p>
            </div>
          ))}
        </div>

        {/* Risk bar */}
        <div className="glass-card p-5 animate-fade-in-up delay-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-white">Risk Level</p>
            <span className="text-sm font-bold" style={{ color: riskColor }}>{riskPct}%</span>
          </div>
          <div className="risk-bar">
            <div className="risk-bar-fill" style={{ width: `${riskPct}%`, background: riskColor }} />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Input prompt */}
          <div className="glass-card p-5 space-y-3 animate-fade-in-up delay-200">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="text-base">📥</span> Agent Prompt
            </h2>
            <div className="code-block">{data.input}</div>
          </div>

          {/* Model response */}
          <div className="glass-card p-5 space-y-3 animate-fade-in-up delay-300">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="text-base">🤖</span> Model Response
            </h2>
            {data.modelResponse ? (
              <div className="code-block">{data.modelResponse}</div>
            ) : (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-rose-400/5 border border-rose-400/15">
                <span className="text-xl">🚫</span>
                <p className="text-sm text-rose-300">No model response — workflow was blocked by policy engine.</p>
              </div>
            )}
          </div>
        </div>

        {/* Risk findings */}
        {data.findings.length > 0 && (
          <div className="glass-card p-5 space-y-4 animate-fade-in-up delay-300">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="text-base">⚠️</span> Risk Findings ({data.findings.length})
            </h2>
            <div className="space-y-2">
              {data.findings.map((f) => (
                <div key={f.id} className="flex items-start gap-3 p-3 rounded-xl bg-rose-400/5 border border-rose-400/10">
                  <span className="badge badge-red flex-shrink-0">{f.category}</span>
                  <p className="text-xs text-slate-400 font-mono">{f.detail}</p>
                  <span className="ml-auto text-xs font-bold text-rose-400 flex-shrink-0">+{f.score}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Event timeline */}
        <div className="glass-card p-5 space-y-4 animate-fade-in-up delay-400">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <span className="text-base">📋</span> Execution Timeline
          </h2>
          <div className="relative pl-6 space-y-0">
            {/* vertical line */}
            <div className="absolute left-2 top-2 bottom-2 w-px bg-gradient-to-b from-cyan-400/40 via-cyan-400/20 to-transparent" />
            {data.events.map((ev, i) => (
              <div key={ev.id} className={`relative flex items-start gap-3 pb-4 animate-fade-in-up`} style={{ animationDelay: `${i * 80}ms` }}>
                {/* dot */}
                <div className="absolute -left-4 top-0.5 w-3.5 h-3.5 rounded-full border-2 border-cyan-400/50 bg-[var(--bg-primary)] flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span>{stageIcons[ev.stage] || "🔹"}</span>
                    <p className="text-sm font-semibold text-white">{ev.stage.replace(/_/g, " ")}</p>
                    <span className="text-xs text-slate-600 ml-auto">
                      {new Date(ev.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{ev.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

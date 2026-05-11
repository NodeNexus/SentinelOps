"use client";
import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/api";

type AuditLog = {
  id: string;
  action: string;
  outcome: string;
  riskScore: number;
  resource: string;
  createdAt?: string;
  agentId?: string;
};

function OutcomeBadge({ outcome }: { outcome: string }) {
  const o = outcome?.toLowerCase();
  if (o === "allowed") return <span className="badge badge-green">✓ Allowed</span>;
  if (o === "blocked") return <span className="badge badge-red">✗ Blocked</span>;
  if (o === "review") return <span className="badge badge-amber">⧗ Review</span>;
  return <span className="badge badge-gray">{outcome}</span>;
}

function RiskMeter({ score }: { score: number }) {
  const pct = Math.min(100, Math.max(0, Number(score) * 10));
  const color = pct >= 70 ? "#f43f5e" : pct >= 40 ? "#f59e0b" : "#10b981";
  return (
    <div className="flex items-center gap-2">
      <div className="risk-bar w-20">
        <div className="risk-bar-fill" style={{ width: `${pct}%`, background: color, transition: "width 0.8s ease" }} />
      </div>
      <span className="text-xs font-mono font-bold" style={{ color }}>{score}</span>
    </div>
  );
}

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "blocked" | "allowed" | "review">("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    apiFetch("/audit")
      .then((r) => r.json())
      .then((d) => { setLogs(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => { setLogs([]); setLoading(false); });
  }, []);

  const filtered = logs
    .filter((l) => filter === "all" || l.outcome?.toLowerCase() === filter)
    .filter((l) =>
      !search ||
      l.action?.toLowerCase().includes(search.toLowerCase()) ||
      l.resource?.toLowerCase().includes(search.toLowerCase())
    );

  const blockedCount = logs.filter((l) => l.outcome?.toLowerCase() === "blocked").length;
  const allowedCount = logs.filter((l) => l.outcome?.toLowerCase() === "allowed").length;

  return (
    <main className="relative z-10 py-10">
      <div className="container space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 animate-fade-in-up">
          <div>
            <span className="section-label">Compliance</span>
            <h1 className="mt-2 text-3xl font-black text-white">Audit Logs</h1>
            <p className="text-slate-400 text-sm mt-1">Immutable record of all agent activity</p>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="badge badge-green">{allowedCount} Allowed</div>
            <div className="badge badge-red">{blockedCount} Blocked</div>
            <div className="badge badge-gray">{logs.length} Total</div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="glass-card p-4 flex flex-col sm:flex-row gap-3 animate-fade-in-up delay-100">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0" />
            </svg>
            <input
              className="input-field pl-10 py-2"
              placeholder="Search by action or resource…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            {(["all", "allowed", "blocked", "review"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wide transition-all duration-200 ${
                  filter === f
                    ? "bg-cyan-400/15 text-cyan-400 border border-cyan-400/30"
                    : "text-slate-500 hover:text-slate-300 hover:bg-white/5 border border-transparent"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Logs Table */}
        <div className="glass-card overflow-hidden animate-fade-in-up delay-200">
          {loading ? (
            <div className="p-8 space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex gap-4">
                  <div className="skeleton h-5 w-32 rounded" />
                  <div className="skeleton h-5 flex-1 rounded" />
                  <div className="skeleton h-5 w-24 rounded" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center">
              <div className="text-4xl mb-3">📋</div>
              <p className="text-slate-400 font-medium">No audit logs found</p>
              <p className="text-slate-600 text-sm mt-1">
                {logs.length === 0 ? "Run a workflow to generate audit events." : "Try adjusting your filters."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Action</th>
                    <th>Resource</th>
                    <th>Risk Score</th>
                    <th>Outcome</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((log, i) => (
                    <tr key={log.id} className={`animate-fade-in-up`} style={{ animationDelay: `${i * 40}ms` }}>
                      <td>
                        <span className="font-medium text-slate-200 font-mono text-xs">{log.action}</span>
                      </td>
                      <td>
                        <span className="text-slate-400 text-xs truncate max-w-[180px] block">{log.resource}</span>
                      </td>
                      <td><RiskMeter score={log.riskScore} /></td>
                      <td><OutcomeBadge outcome={log.outcome} /></td>
                      <td>
                        <span className="text-slate-600 text-xs">
                          {log.createdAt ? new Date(log.createdAt).toLocaleTimeString() : "—"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

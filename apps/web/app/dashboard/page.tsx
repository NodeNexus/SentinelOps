"use client";
import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/api";
import Link from "next/link";

type Stats = {
  totalRequests: number;
  blockedRequests: number;
  humanReviewQueue: number;
  topRiskCategories: { category: string; count: { category: number } }[];
};

function AnimatedCounter({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = value / 40;
    const timer = setInterval(() => {
      start += step;
      if (start >= value) { setDisplay(value); clearInterval(timer); }
      else setDisplay(Math.floor(start));
    }, 30);
    return () => clearInterval(timer);
  }, [value]);
  return <>{display}</>;
}

function StatCard({
  label, value, icon, color, delay, description
}: {
  label: string; value: string | number; icon: React.ReactNode;
  color: string; delay: string; description?: string;
}) {
  const colorMap: Record<string, { bg: string; border: string; text: string; glow: string }> = {
    cyan:    { bg: "rgba(56,189,248,0.08)",   border: "rgba(56,189,248,0.2)",   text: "#38bdf8",   glow: "rgba(56,189,248,0.15)" },
    rose:    { bg: "rgba(244,63,94,0.08)",    border: "rgba(244,63,94,0.2)",    text: "#f43f5e",   glow: "rgba(244,63,94,0.12)" },
    amber:   { bg: "rgba(245,158,11,0.08)",   border: "rgba(245,158,11,0.2)",   text: "#f59e0b",   glow: "rgba(245,158,11,0.12)" },
    purple:  { bg: "rgba(139,92,246,0.08)",   border: "rgba(139,92,246,0.2)",   text: "#8b5cf6",   glow: "rgba(139,92,246,0.12)" },
  };
  const c = colorMap[color] || colorMap.cyan;
  return (
    <article className={`stat-card animate-fade-in-up ${delay}`}>
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.text }}
        >
          {icon}
        </div>
        <span className="badge badge-gray text-[10px]">LIVE</span>
      </div>
      <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">{label}</p>
      <p className="text-3xl font-black" style={{ color: c.text }}>
        {typeof value === "number" ? <AnimatedCounter value={value} /> : value}
      </p>
      {description && <p className="text-xs text-slate-600 mt-1">{description}</p>}
    </article>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/dashboard/stats")
      .then((r) => r.json())
      .then((d) => { setStats(d); setLoading(false); })
      .catch(() => { setStats(null); setLoading(false); });
  }, []);

  const blockRate = stats
    ? Math.round((stats.blockedRequests / Math.max(stats.totalRequests, 1)) * 100)
    : 0;

  return (
    <main className="relative z-10 py-10">
      <div className="container space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 animate-fade-in-up">
          <div>
            <span className="section-label">Overview</span>
            <h1 className="mt-2 text-3xl font-black text-white">Governance Dashboard</h1>
            <p className="text-slate-400 text-sm mt-1">Real-time visibility into AI agent operations</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-400/8 border border-emerald-400/20">
              <span className="status-dot online" />
              <span className="text-xs font-medium text-emerald-400">Systems Nominal</span>
            </div>
            <Link href="/workflows" className="btn-primary">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Workflow
            </Link>
          </div>
        </div>

        {/* Not logged in state */}
        {!loading && !stats && (
          <div className="glass-card p-10 text-center animate-scale-in">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/25 mb-4 animate-float">
              <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Authentication Required</h2>
            <p className="text-slate-400 text-sm mb-6">Please sign in to access governance dashboard data.</p>
            <Link href="/login" className="btn-primary inline-flex">
              Sign In to Dashboard
            </Link>
          </div>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div className="grid gap-4 md:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="stat-card">
                <div className="skeleton h-11 w-11 rounded-xl mb-4" />
                <div className="skeleton h-3 w-24 mb-2 rounded" />
                <div className="skeleton h-8 w-16 rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Stats */}
        {stats && (
          <>
            <div className="grid gap-4 md:grid-cols-4">
              <StatCard
                label="Total Requests" value={stats.totalRequests}
                color="cyan" delay="delay-100" description="All agent interactions"
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
              />
              <StatCard
                label="Blocked" value={stats.blockedRequests}
                color="rose" delay="delay-200" description={`${blockRate}% block rate`}
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>}
              />
              <StatCard
                label="Human Review" value={stats.humanReviewQueue}
                color="amber" delay="delay-300" description="Pending human decisions"
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" /></svg>}
              />
              <StatCard
                label="Top Risk" value={stats.topRiskCategories[0]?.category || "None"}
                color="purple" delay="delay-400" description="Highest risk category"
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
              />
            </div>

            {/* Block rate bar */}
            <div className="glass-card p-6 animate-fade-in-up delay-500">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-white">Threat Mitigation Rate</h2>
                <span className="text-rose-400 font-bold text-sm">{blockRate}%</span>
              </div>
              <div className="risk-bar">
                <div
                  className="risk-bar-fill bg-gradient-to-r from-rose-500 to-rose-400"
                  style={{ width: `${blockRate}%` }}
                />
              </div>
              <p className="text-xs text-slate-500 mt-2">
                {stats.blockedRequests} of {stats.totalRequests} requests blocked by policy engine
              </p>
            </div>

            {/* Risk categories */}
            {stats.topRiskCategories.length > 0 && (
              <div className="glass-card p-6 animate-fade-in-up delay-600">
                <h2 className="text-sm font-semibold text-white mb-4">Risk Category Breakdown</h2>
                <div className="space-y-3">
                  {stats.topRiskCategories.map(({ category }, i) => (
                    <div key={category} className="flex items-center gap-4">
                      <span className="text-xs text-slate-500 w-4">{i + 1}</span>
                      <span className="text-sm text-slate-300 flex-1">{category}</span>
                      <span className="badge badge-red">{i === 0 ? "Critical" : i === 1 ? "High" : "Medium"}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in-up delay-700">
              {[
                { href: "/audit", label: "View Audit Logs", icon: "📋", color: "cyan" },
                { href: "/policies", label: "Manage Policies", icon: "⬛", color: "purple" },
                { href: "/workflows", label: "Run Workflow", icon: "⚡", color: "emerald" },
              ].map(({ href, label, icon }) => (
                <Link key={href} href={href}
                  className="glass-card p-4 flex items-center gap-3 group hover:border-cyan-400/30 transition-all duration-300"
                >
                  <span className="text-2xl">{icon}</span>
                  <span className="text-sm font-semibold text-slate-300 group-hover:text-white transition-colors">{label}</span>
                  <svg className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 ml-auto transition-all duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}

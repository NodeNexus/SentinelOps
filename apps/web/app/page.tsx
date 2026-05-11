"use client";

export default function Home() {
  const cards = [
    {
      title: "The Problem",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      color: "rose",
      text: "Enterprise AI agents operate with unchecked access, prompts bypass safety layers, and there is zero audit trail — creating catastrophic compliance and security blind spots.",
    },
    {
      title: "Our Solution",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      color: "cyan",
      text: "SentinelOps AI intercepts every agent request, scores risk with Gemini, enforces policy rules, routes high-risk actions for human review, and logs everything immutably.",
    },
    {
      title: "Business Value",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      color: "emerald",
      text: "Reduce AI governance risk by 90%, achieve SOC2 & GDPR compliance readiness, and gain real-time executive visibility into agent behavior across your entire organization.",
    },
    {
      title: "Originality",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      color: "purple",
      text: "First enterprise-grade AI trust layer combining real-time prompt injection detection, semantic intent analysis, and policy-as-code — built for the multi-agent era.",
    },
  ];

  const colorMap: Record<string, { badge: string; bg: string; border: string; text: string; glow: string }> = {
    rose:    { badge: "badge-red",    bg: "rgba(244,63,94,0.08)",    border: "rgba(244,63,94,0.2)",    text: "#f43f5e",    glow: "rgba(244,63,94,0.15)" },
    cyan:    { badge: "badge-cyan",   bg: "rgba(56,189,248,0.08)",   border: "rgba(56,189,248,0.2)",   text: "#38bdf8",   glow: "rgba(56,189,248,0.15)" },
    emerald: { badge: "badge-green",  bg: "rgba(16,185,129,0.08)",   border: "rgba(16,185,129,0.2)",   text: "#10b981",   glow: "rgba(16,185,129,0.15)" },
    purple:  { badge: "badge-purple", bg: "rgba(139,92,246,0.08)",   border: "rgba(139,92,246,0.2)",   text: "#8b5cf6",   glow: "rgba(139,92,246,0.15)" },
  };

  const features = [
    { icon: "🛡️", label: "Prompt Risk Detection" },
    { icon: "📋", label: "Policy Enforcement" },
    { icon: "👤", label: "Human-in-the-Loop" },
    { icon: "🔍", label: "Audit Trail" },
    { icon: "⚡", label: "Real-time Analysis" },
    { icon: "🔐", label: "Role-based Access" },
  ];

  return (
    <main className="relative z-10">
      {/* ===== HERO SECTION ===== */}
      <section className="relative py-24 px-4 overflow-hidden">
        {/* Decorative orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, #38bdf8, transparent)" }} />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, #8b5cf6, transparent)" }} />

        <div className="container text-center">
          {/* Status chip */}
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-cyan-400/25 bg-cyan-400/8 animate-fade-in-up">
            <span className="status-dot online" />
            <span className="text-xs font-semibold tracking-widest uppercase text-cyan-400">
              Enterprise AI Governance Platform
            </span>
          </div>

          {/* Headline */}
          <h1 className="mt-2 text-5xl md:text-7xl font-black leading-[1.05] tracking-tight animate-fade-in-up delay-100">
            <span className="text-white">Secure Agent </span>
            <br />
            <span className="gradient-text">Operations</span>
            <br />
            <span className="text-white text-4xl md:text-5xl font-bold">for the Intelligent Enterprise</span>
          </h1>

          {/* Sub */}
          <p className="mt-6 text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200">
            SentinelOps AI is a <span className="text-cyan-400 font-semibold">trust layer</span> for enterprise agents — prompt-risk detection, policy enforcement, role-based controls, and{" "}
            <span className="text-purple-400 font-semibold">compliance-grade audit trails</span>.
          </p>

          {/* CTA */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 animate-fade-in-up delay-300">
            <a href="/dashboard" className="btn-primary text-base px-6 py-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Open Dashboard
            </a>
            <a href="/workflows" className="btn-secondary text-base px-6 py-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Run a Workflow
            </a>
          </div>

          {/* Feature Pills */}
          <div className="mt-14 flex flex-wrap justify-center gap-3 animate-fade-in-up delay-400">
            {features.map(({ icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 px-4 py-2 rounded-xl glass-card text-sm text-slate-300 font-medium hover:text-white cursor-default"
              >
                <span>{icon}</span>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== METRICS STRIP ===== */}
      <section className="py-10 border-y border-[rgba(99,179,237,0.1)] bg-[rgba(13,20,36,0.6)] backdrop-blur-sm">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Threats Blocked", value: "99.7%", color: "#38bdf8" },
              { label: "Latency Overhead", value: "<50ms", color: "#10b981" },
              { label: "Policy Rules", value: "12+", color: "#8b5cf6" },
              { label: "Audit Events", value: "∞", color: "#f59e0b" },
            ].map(({ label, value, color }, i) => (
              <div
                key={label}
                className={`text-center animate-fade-in-up delay-${(i + 1) * 100}`}
              >
                <div className="text-4xl font-black" style={{ color }}>{value}</div>
                <div className="mt-1 text-sm text-slate-500 font-medium">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== NARRATIVE CARDS ===== */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12 animate-fade-in-up">
            <span className="section-label">Why SentinelOps</span>
            <h2 className="mt-3 text-3xl font-bold text-white">Built for the Agentic Age</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {cards.map(({ title, icon, color, text }, i) => {
              const c = colorMap[color];
              return (
                <article
                  key={title}
                  className={`glass-card p-6 animate-fade-in-up delay-${(i + 1) * 150}`}
                  style={{ boxShadow: `0 4px 32px rgba(0,0,0,0.4), 0 0 0 0 ${c.glow}` }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 12px 40px rgba(0,0,0,0.5), 0 0 30px ${c.glow}`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 32px rgba(0,0,0,0.4)`;
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.text }}
                    >
                      {icon}
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">{title}</h2>
                      <p className="mt-2 text-sm text-slate-400 leading-relaxed">{text}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== ARCHITECTURE SECTION ===== */}
      <section className="py-20 bg-[rgba(13,20,36,0.5)]">
        <div className="container">
          <div className="text-center mb-12 animate-fade-in-up">
            <span className="section-label">Architecture</span>
            <h2 className="mt-3 text-3xl font-bold text-white">How It Works</h2>
          </div>
          <div className="flex flex-col md:flex-row items-start justify-center gap-4 animate-fade-in-up delay-200">
            {[
              { step: "01", label: "Agent Request", icon: "🤖", desc: "AI agent submits a task request with intent" },
              { step: "02", label: "Risk Scoring", icon: "🧠", desc: "Gemini analyzes prompt for injection & risks" },
              { step: "03", label: "Policy Check", icon: "📋", desc: "Rules engine enforces compliance policies" },
              { step: "04", label: "Execute / Block", icon: "⚡", desc: "Allow, block, or route for human review" },
              { step: "05", label: "Audit Log", icon: "📝", desc: "Every event logged immutably for compliance" },
            ].map(({ step, label, icon, desc }, i) => (
              <div key={step} className="flex md:flex-col items-center md:items-center gap-4 md:gap-2 flex-1">
                <div className="relative flex-shrink-0">
                  <div className="w-14 h-14 rounded-2xl glass-card flex flex-col items-center justify-center gap-0.5 border border-cyan-400/20">
                    <span className="text-xl">{icon}</span>
                    <span className="text-xs text-cyan-400/60 font-mono">{step}</span>
                  </div>
                  {i < 4 && (
                    <div className="hidden md:block absolute top-7 left-full w-full h-px bg-gradient-to-r from-cyan-400/40 to-transparent" />
                  )}
                </div>
                <div className="md:text-center">
                  <p className="text-sm font-semibold text-white">{label}</p>
                  <p className="text-xs text-slate-500 mt-1 max-w-[120px] md:mx-auto">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="py-10 border-t border-[rgba(99,179,237,0.1)]">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400/20 to-blue-600/20 border border-cyan-400/30 flex items-center justify-center">
              <span className="text-cyan-400 text-sm font-bold">S</span>
            </div>
            <span className="text-sm text-slate-500">SentinelOps AI — Enterprise Agent Governance</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="status-dot online" />
            <span className="text-xs text-emerald-400 font-medium">All systems operational</span>
          </div>
        </div>
      </footer>
    </main>
  );
}

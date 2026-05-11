"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/api";

type Workflow = {
  id: string;
  title: string;
  decision: string;
  riskScore: number;
  createdAt?: string;
};

function DecisionBadge({ decision }: { decision: string }) {
  const d = decision?.toUpperCase();
  if (d === "BLOCK") return <span className="badge badge-red">🚫 Blocked</span>;
  if (d === "ALLOW") return <span className="badge badge-green">✓ Allowed</span>;
  if (d === "REVIEW") return <span className="badge badge-amber">⧗ Review</span>;
  return <span className="badge badge-gray">{decision}</span>;
}

function RiskBadge({ score }: { score: number }) {
  if (score >= 8) return <span className="badge badge-red">Risk: {score}</span>;
  if (score >= 5) return <span className="badge badge-amber">Risk: {score}</span>;
  return <span className="badge badge-green">Risk: {score}</span>;
}

export default function WorkflowsPage() {
  const [items, setItems] = useState<Workflow[]>([]);
  const [title, setTitle] = useState("Contract obligation extractor");
  const [input, setInput] = useState("Summarize this contract and extract obligations.");
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(true);

  async function load() {
    const data = await (await apiFetch("/workflows")).json();
    setItems(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => { load().catch(() => { setItems([]); setLoading(false); }); }, []);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    try {
      await apiFetch("/workflows", {
        method: "POST",
        body: JSON.stringify({ title, input, declaredIntent: "Document Analysis" }),
      });
      await load();
    } finally {
      setCreating(false);
    }
  }

  return (
    <main className="relative z-10 py-10">
      <div className="container space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 animate-fade-in-up">
          <div>
            <span className="section-label">Agent Operations</span>
            <h1 className="mt-2 text-3xl font-black text-white">Workflows</h1>
            <p className="text-slate-400 text-sm mt-1">Create and monitor governed AI agent workflows</p>
          </div>
          <div className="badge badge-cyan">{items.length} workflows total</div>
        </div>

        {/* Create Workflow Form */}
        <div className="glass-card p-6 animate-fade-in-up delay-100">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-cyan-400/10 border border-cyan-400/25 flex items-center justify-center">
              <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <h2 className="font-bold text-white">New Workflow</h2>
              <p className="text-xs text-slate-500">Submit an agent task through the governance pipeline</p>
            </div>
          </div>

          <form onSubmit={create} className="space-y-4" id="create-workflow-form">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">
                Workflow Title
              </label>
              <input
                id="workflow-title"
                className="input-field"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Contract obligation extractor"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">
                Agent Prompt
              </label>
              <textarea
                id="workflow-input"
                className="textarea-field font-mono text-sm"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={4}
                placeholder="Enter the agent prompt to analyze and execute…"
                required
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                id="run-workflow-btn"
                type="submit"
                disabled={creating}
                className="btn-primary"
                style={{ opacity: creating ? 0.7 : 1 }}
              >
                {creating ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Processing…
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Run Workflow
                  </>
                )}
              </button>
              <p className="text-xs text-slate-600">Prompt will be risk-scored and policy-checked before execution</p>
            </div>
          </form>
        </div>

        {/* Workflow List */}
        <div className="space-y-3 animate-fade-in-up delay-200">
          <h2 className="font-bold text-white">Recent Workflows <span className="text-slate-500 font-normal text-sm">({items.length})</span></h2>

          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="glass-card p-4 flex items-center gap-4">
                  <div className="skeleton flex-1 h-5 rounded" />
                  <div className="skeleton h-5 w-20 rounded-full" />
                  <div className="skeleton h-5 w-16 rounded-full" />
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="glass-card py-14 text-center">
              <div className="text-5xl mb-4 animate-float inline-block">⟳</div>
              <p className="text-slate-400 font-semibold">No workflows yet</p>
              <p className="text-slate-600 text-sm mt-1">Create your first workflow above to get started.</p>
            </div>
          ) : (
            items.map((w, i) => (
              <Link
                key={w.id}
                href={`/workflows/${w.id}`}
                id={`workflow-item-${w.id}`}
                className={`glass-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:border-cyan-400/30 animate-fade-in-up`}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-200 group-hover:text-white transition-colors text-sm truncate">{w.title}</p>
                    {w.createdAt && (
                      <p className="text-xs text-slate-600 mt-0.5">
                        {new Date(w.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <RiskBadge score={w.riskScore} />
                  <DecisionBadge decision={w.decision} />
                  <svg className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 transition-all duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </main>
  );
}

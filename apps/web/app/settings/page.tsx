"use client";
import { useState, useEffect } from "react";
import { API_URL } from "../../lib/api";

type Section = "api" | "auth" | "notifications" | "integrations" | "retention";

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<Section>("api");

  // --- API Config state ---
  const [apiUrl, setApiUrl] = useState(API_URL);
  const [apiSaved, setApiSaved] = useState(false);
  const [apiStatus, setApiStatus] = useState<"idle" | "checking" | "ok" | "fail">("idle");

  // --- Auth state ---
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword]         = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwMsg, setPwMsg]                     = useState("");

  // --- Notifications state ---
  const [notifs, setNotifs] = useState({
    blockEvents: true,
    humanReview: true,
    highRisk: false,
    dailyDigest: false,
  });

  // --- Retention state ---
  const [retentionDays, setRetentionDays] = useState(90);
  const [retentionSaved, setRetentionSaved] = useState(false);

  // Load user info
  const [user, setUser] = useState<{ email: string; name?: string; role: string } | null>(null);
  useEffect(() => {
    try {
      const raw = localStorage.getItem("sentinelUser");
      if (raw) setUser(JSON.parse(raw));
    } catch {}
  }, []);

  function saveApi(e: React.FormEvent) {
    e.preventDefault();
    setApiSaved(true);
    setTimeout(() => setApiSaved(false), 2500);
  }

  async function testConnection() {
    setApiStatus("checking");
    try {
      const res = await fetch(`${apiUrl}/dashboard/metrics`, { signal: AbortSignal.timeout(4000) });
      setApiStatus(res.ok ? "ok" : "fail");
    } catch {
      setApiStatus("fail");
    }
    setTimeout(() => setApiStatus("idle"), 4000);
  }

  function savePassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) { setPwMsg("Passwords do not match."); return; }
    if (newPassword.length < 8) { setPwMsg("Password must be at least 8 characters."); return; }
    setPwMsg("success");
    setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    setTimeout(() => setPwMsg(""), 3000);
  }

  function saveRetention(e: React.FormEvent) {
    e.preventDefault();
    setRetentionSaved(true);
    setTimeout(() => setRetentionSaved(false), 2500);
  }

  const sections = [
    { id: "api",           label: "API Configuration",   icon: "⚙️" },
    { id: "auth",          label: "Authentication",       icon: "🔐" },
    { id: "notifications", label: "Notifications",        icon: "🔔" },
    { id: "integrations",  label: "Integrations",         icon: "🔗" },
    { id: "retention",     label: "Audit Retention",      icon: "📋" },
  ] as const;

  return (
    <main className="relative z-10 py-10">
      <div className="container space-y-8">

        {/* Header */}
        <div className="animate-fade-in-up">
          <span className="section-label">Configuration</span>
          <h1 className="mt-2 text-3xl font-black text-white">Settings</h1>
          <p className="text-slate-400 text-sm mt-1">Manage SentinelOps AI configuration and integrations</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="space-y-1 animate-slide-left">
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider px-2 mb-3">Sections</p>
            {sections.map(({ id, label, icon }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 text-left ${
                  activeSection === id
                    ? "bg-cyan-400/10 text-cyan-400 border border-cyan-400/25"
                    : "text-slate-500 hover:text-slate-300 hover:bg-white/5 border border-transparent"
                }`}
              >
                <span>{icon}</span>
                {label}
              </button>
            ))}
          </div>

          {/* Main panel */}
          <div className="md:col-span-3 animate-slide-right">

            {/* ── API Configuration ── */}
            {activeSection === "api" && (
              <div className="glass-card p-6 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-400/10 border border-cyan-400/25 flex items-center justify-center text-cyan-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="font-bold text-white">API Configuration</h2>
                    <p className="text-xs text-slate-500">Configure backend API endpoint</p>
                  </div>
                </div>

                <form onSubmit={saveApi} className="space-y-5" id="settings-api-form">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">API Base URL</label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2">
                        <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
                        </svg>
                      </div>
                      <input id="settings-api-url" className="input-field pl-10 font-mono text-sm" value={apiUrl} onChange={(e) => setApiUrl(e.target.value)} placeholder="http://localhost:4000" />
                    </div>
                    <p className="mt-2 text-xs text-slate-600">
                      Set <code className="text-cyan-500/80 bg-cyan-500/5 px-1 rounded">NEXT_PUBLIC_API_URL</code> in{" "}
                      <code className="text-cyan-500/80 bg-cyan-500/5 px-1 rounded">.env.local</code> to persist for deployment.
                    </p>
                  </div>

                  {/* Connection test */}
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/6">
                    <span className={`status-dot ${apiStatus === "ok" ? "online" : apiStatus === "fail" ? "danger" : "offline"}`} />
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-white">
                        {apiStatus === "ok" ? "API Reachable" : apiStatus === "fail" ? "API Unreachable" : apiStatus === "checking" ? "Checking…" : "Connection Unknown"}
                      </p>
                      <p className="text-xs text-slate-600">{apiUrl}</p>
                    </div>
                    <button type="button" onClick={testConnection} disabled={apiStatus === "checking"} className="btn-secondary text-xs py-1.5 px-3">
                      {apiStatus === "checking" ? (
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                      ) : "Test Connection"}
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <button id="settings-save-btn" type="submit" className="btn-primary">
                      {apiSaved ? (
                        <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Saved!</>
                      ) : (
                        <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>Save Changes</>
                      )}
                    </button>
                    {apiSaved && <span className="text-xs text-emerald-400 animate-fade-in font-medium">✓ Configuration saved</span>}
                  </div>
                </form>

                {/* System info */}
                <div className="border-t border-white/6 pt-6">
                  <h3 className="text-sm font-semibold text-white mb-4">System Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {[
                      { label: "Version",      value: "0.1.0" },
                      { label: "Environment",  value: "Development" },
                      { label: "AI Model",     value: "Gemini 1.5 Flash" },
                      { label: "Database",     value: "PostgreSQL 16" },
                      { label: "Cache",        value: "Redis 7" },
                      { label: "Node.js",      value: process.env.NEXT_PUBLIC_NODE_ENV || "v18+" },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <p className="text-xs text-slate-600 font-medium uppercase tracking-wide">{label}</p>
                        <p className="text-slate-300 font-semibold mt-0.5">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── Authentication ── */}
            {activeSection === "auth" && (
              <div className="glass-card p-6 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-400/10 border border-purple-400/25 flex items-center justify-center text-purple-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="font-bold text-white">Authentication</h2>
                    <p className="text-xs text-slate-500">Manage your account security</p>
                  </div>
                </div>

                {/* Current user */}
                {user && (
                  <div className="p-4 rounded-xl bg-white/3 border border-white/6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-cyan-400/10 border border-cyan-400/25 flex items-center justify-center text-cyan-400 font-bold text-lg">
                      {user.name?.slice(0,2).toUpperCase() || user.email.slice(0,2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{user.name || "User"}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                      <span className="badge badge-amber mt-1">{user.role}</span>
                    </div>
                  </div>
                )}

                <form onSubmit={savePassword} className="space-y-4" id="settings-password-form">
                  <h3 className="text-sm font-semibold text-white">Change Password</h3>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">Current Password</label>
                    <input className="input-field" type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="Enter current password" required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">New Password</label>
                    <input className="input-field" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Min 8 characters" required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">Confirm New Password</label>
                    <input className="input-field" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Repeat new password" required />
                  </div>
                  {pwMsg && (
                    <div className={`flex items-center gap-2 p-3 rounded-xl text-sm animate-fade-in ${pwMsg === "success" ? "bg-emerald-500/10 border border-emerald-500/25 text-emerald-400" : "bg-rose-500/10 border border-rose-500/25 text-rose-400"}`}>
                      {pwMsg === "success" ? "✓ Password updated successfully." : pwMsg}
                    </div>
                  )}
                  <button type="submit" className="btn-primary">Update Password</button>
                </form>

                <div className="border-t border-white/6 pt-5 space-y-3">
                  <h3 className="text-sm font-semibold text-white">Session</h3>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/3 border border-white/6">
                    <div>
                      <p className="text-sm text-white font-medium">JWT Token</p>
                      <p className="text-xs text-slate-500">Authentication expires with browser session</p>
                    </div>
                    <span className="badge badge-green">Active</span>
                  </div>
                </div>
              </div>
            )}

            {/* ── Notifications ── */}
            {activeSection === "notifications" && (
              <div className="glass-card p-6 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/25 flex items-center justify-center text-amber-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="font-bold text-white">Notifications</h2>
                    <p className="text-xs text-slate-500">Configure alert preferences</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { key: "blockEvents",  label: "Block Events",      desc: "Alert when a workflow is blocked by policy" },
                    { key: "humanReview",  label: "Human Review Queue", desc: "Alert when an item needs human decision" },
                    { key: "highRisk",     label: "High Risk Prompts",  desc: "Alert on risk score above 70" },
                    { key: "dailyDigest",  label: "Daily Digest",       desc: "Daily summary of agent activity" },
                  ].map(({ key, label, desc }) => (
                    <div key={key} className="flex items-center justify-between p-4 rounded-xl bg-white/3 border border-white/6 hover:border-white/10 transition-colors">
                      <div>
                        <p className="text-sm font-semibold text-white">{label}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                      </div>
                      <button
                        onClick={() => setNotifs(n => ({...n, [key]: !n[key as keyof typeof n]}))}
                        className={`w-12 h-6 rounded-full flex items-center px-0.5 transition-all duration-300 flex-shrink-0 ${
                          notifs[key as keyof typeof notifs]
                            ? "bg-cyan-500/40 border border-cyan-500/50"
                            : "bg-slate-700/50 border border-slate-600/50"
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full transition-all duration-300 ${notifs[key as keyof typeof notifs] ? "translate-x-6 bg-cyan-400" : "translate-x-0 bg-slate-400"}`} />
                      </button>
                    </div>
                  ))}
                </div>
                <button className="btn-primary" onClick={() => {}}>Save Preferences</button>
              </div>
            )}

            {/* ── Integrations ── */}
            {activeSection === "integrations" && (
              <div className="glass-card p-6 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-400/10 border border-emerald-400/25 flex items-center justify-center text-emerald-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="font-bold text-white">Integrations</h2>
                    <p className="text-xs text-slate-500">Connect external services</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { name: "Google Gemini",    desc: "AI model for risk analysis",       status: "connected",     icon: "🤖" },
                    { name: "PostgreSQL",        desc: "Primary database",                 status: "connected",     icon: "🐘" },
                    { name: "Redis",             desc: "Cache & session store",            status: "connected",     icon: "⚡" },
                    { name: "Slack Webhooks",    desc: "Send alerts to Slack channels",   status: "not_connected", icon: "💬" },
                    { name: "PagerDuty",         desc: "Incident management",             status: "not_connected", icon: "🚨" },
                    { name: "Datadog",           desc: "Metrics & observability",         status: "not_connected", icon: "📊" },
                  ].map(({ name, desc, status, icon }) => (
                    <div key={name} className="flex items-center gap-4 p-4 rounded-xl bg-white/3 border border-white/6 hover:border-white/10 transition-colors">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xl flex-shrink-0">{icon}</div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-white">{name}</p>
                        <p className="text-xs text-slate-500">{desc}</p>
                      </div>
                      {status === "connected" ? (
                        <span className="badge badge-green">Connected</span>
                      ) : (
                        <button className="btn-secondary text-xs py-1.5 px-3">Connect</button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Audit Retention ── */}
            {activeSection === "retention" && (
              <div className="glass-card p-6 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-400/10 border border-rose-400/25 flex items-center justify-center text-rose-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="font-bold text-white">Audit Log Retention</h2>
                    <p className="text-xs text-slate-500">Control how long audit records are kept</p>
                  </div>
                </div>

                <form onSubmit={saveRetention} className="space-y-5" id="settings-retention-form">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">
                      Retention Period (days): <span className="text-cyan-400">{retentionDays}</span>
                    </label>
                    <input
                      type="range" min={7} max={365} step={7}
                      value={retentionDays}
                      onChange={e => setRetentionDays(Number(e.target.value))}
                      className="w-full accent-cyan-400"
                    />
                    <div className="flex justify-between text-xs text-slate-600 mt-1">
                      <span>7 days</span><span>365 days</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { days: 30,  label: "30 days",  desc: "Short-term" },
                      { days: 90,  label: "90 days",  desc: "Standard" },
                      { days: 365, label: "1 year",   desc: "Compliance" },
                    ].map(({ days, label, desc }) => (
                      <button
                        key={days} type="button"
                        onClick={() => setRetentionDays(days)}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          retentionDays === days
                            ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-400"
                            : "border-white/6 bg-white/3 text-slate-400 hover:border-white/15"
                        }`}
                      >
                        <p className="text-sm font-bold">{label}</p>
                        <p className="text-xs mt-0.5">{desc}</p>
                      </button>
                    ))}
                  </div>

                  <div className="p-4 rounded-xl bg-amber-400/5 border border-amber-400/15 flex items-start gap-3">
                    <svg className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <p className="text-xs text-amber-300/80">
                      Logs older than {retentionDays} days will be automatically purged. For compliance (SOC2/GDPR), a minimum of 90 days is recommended.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button type="submit" className="btn-primary">
                      {retentionSaved ? "✓ Saved!" : "Save Retention Policy"}
                    </button>
                    {retentionSaved && <span className="text-xs text-emerald-400 animate-fade-in">✓ Policy updated</span>}
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

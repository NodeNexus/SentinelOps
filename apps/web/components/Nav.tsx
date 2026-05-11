"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/workflows",  label: "Workflows" },
  { href: "/policies",   label: "Policies" },
  { href: "/audit",      label: "Audit" },
  { href: "/settings",   label: "Settings" },
];

function roleColor(role: string) {
  if (role === "ADMIN")   return { text: "#f59e0b", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.3)" };
  if (role === "AUDITOR") return { text: "#8b5cf6", bg: "rgba(139,92,246,0.12)", border: "rgba(139,92,246,0.3)" };
  return                          { text: "#38bdf8", bg: "rgba(56,189,248,0.12)", border: "rgba(56,189,248,0.3)" };
}

export default function Nav() {
  const pathname = usePathname();
  const router   = useRouter();
  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user,        setUser]        = useState<{ email: string; name?: string; role: string } | null>(null);

  // Restore user from localStorage (stored on login)
  useEffect(() => {
    const raw = typeof window !== "undefined" ? localStorage.getItem("sentinelUser") : null;
    if (!raw) { setUser(null); return; }
    try {
      setUser(JSON.parse(raw));
    } catch {
      setUser(null);
    }
  }, [pathname]); // re-check on every route change

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close profile dropdown on outside click
  useEffect(() => {
    if (!profileOpen) return;
    const close = () => setProfileOpen(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [profileOpen]);

  function signOut() {
    localStorage.removeItem("token");
    localStorage.removeItem("sentinelUser");
    setUser(null);
    router.push("/login");
  }

  const initials = user
    ? (user.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) ||
       user.email.slice(0, 2).toUpperCase())
    : null;

  const rc = user ? roleColor(user.role) : null;

  return (
    <header
      className={`scan-container sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[rgba(7,11,20,0.92)] backdrop-blur-xl border-b border-[rgba(99,179,237,0.12)] shadow-[0_4px_32px_rgba(0,0,0,0.4)]"
          : "bg-[rgba(7,11,20,0.7)] backdrop-blur-md border-b border-transparent"
      }`}
    >
      <div className="container flex items-center justify-between h-16">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group" aria-label="SentinelOps AI Home">
          <div className="relative w-9 h-9 flex items-center justify-center">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-400/20 to-blue-600/20 border border-cyan-400/30 group-hover:border-cyan-400/60 transition-all duration-300" />
            <div className="absolute inset-0 rounded-xl animate-spin-slow opacity-30"
              style={{ background: "conic-gradient(transparent 270deg, rgba(56,189,248,0.6) 360deg)" }} />
            <span className="relative text-cyan-400 text-lg font-bold leading-none">S</span>
          </div>
          <div>
            <span className="text-sm font-bold tracking-wide text-white group-hover:text-cyan-300 transition-colors duration-200">
              SentinelOps
            </span>
            <span className="ml-1 text-xs font-light text-cyan-400/80">AI</span>
            <div className="h-px bg-gradient-to-r from-cyan-400/60 to-transparent w-0 group-hover:w-full transition-all duration-300" />
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Primary navigation">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`nav-link ${pathname === href || pathname.startsWith(href + "/") ? "active" : ""}`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-3">
          {/* Live Status */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[rgba(16,185,129,0.08)] border border-[rgba(16,185,129,0.2)]">
            <span className="status-dot online" />
            <span className="text-xs font-medium text-emerald-400">Live</span>
          </div>

          {/* Signed-in user */}
          {user ? (
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                id="profile-btn"
                onClick={() => setProfileOpen((v) => !v)}
                className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl border transition-all duration-200 hover:border-cyan-400/40"
                style={{ borderColor: rc?.border, background: rc?.bg }}
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background: "rgba(255,255,255,0.08)", color: rc?.text }}
                >
                  {initials}
                </div>
                <div className="text-left">
                  <p className="text-xs font-semibold text-white leading-none">{user.name || user.email.split("@")[0]}</p>
                  <p className="text-[10px] leading-none mt-0.5" style={{ color: rc?.text }}>{user.role}</p>
                </div>
                <svg className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown */}
              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 glass-card border border-[rgba(99,179,237,0.15)] rounded-xl overflow-hidden shadow-2xl animate-scale-in">
                  {/* User info header */}
                  <div className="px-4 py-3 border-b border-[rgba(255,255,255,0.06)]">
                    <p className="text-sm font-semibold text-white">{user.name || "User"}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    <div className="mt-2 inline-flex">
                      <span className="badge" style={{ color: rc?.text, background: rc?.bg, borderColor: rc?.border }}>
                        {user.role}
                      </span>
                    </div>
                  </div>
                  {/* Menu items */}
                  <div className="py-1">
                    <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors" onClick={() => setProfileOpen(false)}>
                      <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10" /></svg>
                      Dashboard
                    </Link>
                    <Link href="/audit" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors" onClick={() => setProfileOpen(false)}>
                      <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      My Audit Logs
                    </Link>
                    <Link href="/settings" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors" onClick={() => setProfileOpen(false)}>
                      <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      Settings
                    </Link>
                  </div>
                  <div className="border-t border-[rgba(255,255,255,0.06)] py-1">
                    <button
                      id="signout-btn"
                      onClick={signOut}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="btn-primary" id="nav-login-btn">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg border border-[rgba(99,179,237,0.2)] text-slate-400 hover:text-white hover:border-cyan-400/40 transition-all"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <div className="w-5 h-4 flex flex-col justify-between">
            <span className={`block h-0.5 bg-current transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-1.5" : ""}`} />
            <span className={`block h-0.5 bg-current transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 bg-current transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="container pb-4 flex flex-col gap-1">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                pathname === href
                  ? "bg-cyan-400/10 text-cyan-400 border border-cyan-400/25"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
              onClick={() => setMobileOpen(false)}
            >
              {label}
            </Link>
          ))}
          {user ? (
            <button onClick={signOut} className="btn-danger mt-2 justify-center">Sign Out</button>
          ) : (
            <Link href="/login" className="btn-primary mt-2 justify-center" onClick={() => setMobileOpen(false)}>
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export function token() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("token") || "";
}

export async function apiFetch(path: string, init?: RequestInit) {
  const headers: Record<string, string> = { "Content-Type": "application/json", ...(init?.headers as Record<string, string> || {}) };
  const t = token();
  if (t) headers["Authorization"] = `Bearer ${t}`;
  const res = await fetch(`${API_URL}${path}`, { ...init, headers, cache: "no-store" });
  if (!res.ok) throw new Error(await res.text());
  return res;
}

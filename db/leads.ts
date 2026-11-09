import { env } from "cloudflare:workers";
import type { LeadSubmission, SavedLead } from "@/lib/leads";

function database() {
  if (!env.DB) throw new Error("lead_database_unavailable");
  return env.DB;
}
export async function digest(value: string) {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(bytes), value => value.toString(16).padStart(2, "0")).join("");
}
export async function saveLead(data: LeadSubmission, ip: string | null) {
  const db = database();
  const hash = await digest(JSON.stringify(data));
  const previous = await db.prepare("SELECT request_hash FROM leads WHERE id = ?").bind(data.id).first<{request_hash: string}>();
  if (previous) return previous.request_hash === hash ? "saved" : "conflict";
  const ipHash = ip ? await digest(ip) : "";
  if (ipHash) {
    const count = await db.prepare("SELECT COUNT(*) AS total FROM leads WHERE ip_hash = ? AND created_at >= ?").bind(ipHash, new Date(Date.now() - 600_000).toISOString()).first<{total: number}>();
    if ((count?.total ?? 0) >= 10) return "limited";
  }
  await db.prepare(`INSERT INTO leads (id, source, name, phone, company, city, state, segment, brand, subject, demand, cnpj, created_at, request_hash, ip_hash, entry_path, referrer_host, utm_source, utm_medium, utm_campaign)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT(id) DO NOTHING`).bind(
    data.id, data.source, data.name, data.phone, data.company, data.city, data.state,
    data.segment, data.brand, data.source === "attendance" ? data.subject : "catalogo",
    data.demand, data.source === "attendance" ? data.cnpj : null, new Date().toISOString(), hash, ipHash,
    data.attribution?.entry_path ?? null, data.attribution?.referrer_host || null,
    data.attribution?.utm_source || null, data.attribution?.utm_medium || null, data.attribution?.utm_campaign || null,
  ).run();
  const saved = await db.prepare("SELECT request_hash FROM leads WHERE id = ?").bind(data.id).first<{request_hash: string}>();
  return saved?.request_hash === hash ? "saved" : "conflict";
}
const columns = "id, source, name, phone, company, city, state, segment, brand, subject, demand, cnpj, created_at, entry_path, referrer_host, utm_source, utm_medium, utm_campaign";
export async function listLeads(limit = 51, before?: { date: string; id: string }) {
  const query = before
    ? database().prepare(`SELECT ${columns} FROM leads WHERE (created_at, id) < (?, ?) ORDER BY created_at DESC, id DESC LIMIT ?`).bind(before.date, before.id, limit)
    : database().prepare(`SELECT ${columns} FROM leads ORDER BY created_at DESC, id DESC LIMIT ?`).bind(limit);
  return (await query.all<SavedLead>()).results;
}

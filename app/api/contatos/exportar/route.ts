import { listLeads } from "@/db/leads";
import { commercialOwner } from "@/lib/commercial-auth";
import { csvCell } from "@/lib/leads";
import { catalogBrands } from "@/lib/catalog-data";
import { attendanceSubjects, type AttendanceSubject } from "@/lib/attendance";

export const dynamic = "force-dynamic";
export async function GET() {
  if (!await commercialOwner()) return Response.json({ error: "Acesso restrito." }, { status: 403, headers: { "Cache-Control": "no-store" } });
  try {
    const rows = await listLeads(10_000);
    const csv = [["Data (UTC)", "Origem", "Nome", "WhatsApp", "Empresa", "Cidade", "UF", "Segmento", "Marca", "Demanda", "Observação", "CNPJ", "Página de entrada", "Site de origem", "Canal (UTM)", "Meio (UTM)", "Campanha (UTM)"].map(csvCell).join(";"),
      ...rows.map(row => [row.created_at, row.source === "catalog" ? "Catálogo" : "Atendimento", row.name, row.phone, row.company, row.city, row.state, row.segment,
        catalogBrands.find(brand => brand.slug === row.brand)?.name ?? row.brand,
        attendanceSubjects[row.subject as AttendanceSubject] ?? row.subject, row.demand, row.cnpj,
        row.entry_path, row.referrer_host, row.utm_source, row.utm_medium, row.utm_campaign].map(csvCell).join(";"))].join("\r\n");
    return new Response(`\uFEFF${csv}`, { headers: {
      "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="arco-contatos-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff",
    } });
  } catch {
    console.error("lead_export_unavailable");
    return Response.json({ error: "Exportação indisponível. Tente novamente." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}

import type { Metadata } from "next";
import { requireChatGPTUser, chatGPTSignOutPath } from "@/app/chatgpt-auth";
import { isCommercialOwner } from "@/lib/commercial-auth";
import { listLeads } from "@/db/leads";
import { catalogBrands } from "@/lib/catalog-data";
import { attendanceSubjects, type AttendanceSubject } from "@/lib/attendance";
import Link from "@/components/site-link";
import styles from "./page.module.css";
import type { SavedLead } from "@/lib/leads";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Contatos comerciais | ARCO", robots: { index: false, follow: false } };

async function ContactList({ before, cursor }: { before?: string; cursor?: string }) {
  const user = await requireChatGPTUser("/comercial/contatos");
  if (!isCommercialOwner(user)) return <section className={styles.message}><h1>Acesso restrito à ARCO.</h1><p>Esta conta não tem permissão para consultar os contatos comerciais.</p><a href={chatGPTSignOutPath("/comercial/contatos")} target="_top">Entrar com outra conta</a></section>;
  const validCursor = before && /^\d{4}-\d{2}-\d{2}T/.test(before) && cursor && /^[a-f0-9-]{36}$/i.test(cursor) ? { date: before.slice(0, 24), id: cursor } : undefined;
  let results: SavedLead[] | null = null;
  try { results = await listLeads(51, validCursor); }
  catch { console.error("lead_list_unavailable"); }
  if (!results) return <section className={styles.message} role="alert"><h1>Não foi possível carregar os contatos.</h1><p>Tente novamente em alguns instantes.</p><Link href="/comercial/contatos">Tentar novamente</Link></section>;
    const rows = results.slice(0, 50);
    const last = rows.at(-1);
    return <>
      <header className={styles.header}><div><p className="section-eyebrow">Área comercial · acesso restrito</p><h1>Contatos recebidos.</h1><p>Interesses nos catálogos e demandas de atendimento, do mais recente para o mais antigo.</p></div>
        <div className={styles.actions}><a href="/api/contatos/exportar" download>Exportar CSV</a><Link href="/comercial/contatos">Atualizar lista</Link></div></header>
      <p className={styles.note}>A exportação inclui os 10.000 contatos mais recentes. Os dados ficam disponíveis somente para a conta proprietária da ARCO.</p>
      {rows.length ? <div className={styles.list}>{rows.map(row => {
        const brand = catalogBrands.find(brand => brand.slug === row.brand)?.name ?? "Mais de uma marca / não definida";
        const date = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short", timeZone: "America/Recife" }).format(new Date(row.created_at));
        return <article key={row.id} className={styles.contact}>
          <div className={styles.contactHeader}><span>{row.source === "catalog" ? "Catálogo" : "Atendimento"}</span><time dateTime={row.created_at}>{date} · Recife</time></div>
          <h2>{row.company}</h2><p>{row.name} · {row.city}/{row.state}</p>
          <dl><div><dt>WhatsApp</dt><dd>{row.phone}</dd></div><div><dt>Tipo de empresa</dt><dd>{row.segment}</dd></div><div><dt>Marca</dt><dd>{brand}</dd></div><div><dt>Demanda</dt><dd>{attendanceSubjects[row.subject as AttendanceSubject] ?? row.subject}</dd></div>{row.cnpj && <div><dt>CNPJ</dt><dd>{row.cnpj}</dd></div>}
            <div><dt>Canal de entrada</dt><dd>{row.utm_source || row.referrer_host || "Não identificado"}</dd></div>
            {row.utm_campaign && <div><dt>Campanha</dt><dd>{row.utm_campaign}</dd></div>}
            {row.utm_medium && <div><dt>Meio da campanha</dt><dd>{row.utm_medium}</dd></div>}
            {row.entry_path && <div><dt>Página de entrada</dt><dd>{row.entry_path}</dd></div>}
          </dl>
          {row.demand && <p className={styles.demand}>{row.demand}</p>}
        </article>;
      })}</div> : <section className={styles.message}><h2>{validCursor ? "Nenhum contato anterior." : "Ainda não há contatos recebidos."}</h2><p>Os contatos salvos nos formulários de catálogo e atendimento aparecerão aqui.</p></section>}
      <nav className={styles.pagination} aria-label="Paginação dos contatos">{validCursor && <Link href="/comercial/contatos">Voltar aos mais recentes</Link>}{results.length > 50 && last && <Link href={`/comercial/contatos?${new URLSearchParams({ before: last.created_at, cursor: last.id })}`}>Ver contatos anteriores</Link>}</nav>
      <footer className={styles.session}>Conectado como {user.email}. <a href={chatGPTSignOutPath("/")} target="_top">Sair da conta</a></footer>
    </>;
}

export default async function ContactsPage({ searchParams }: { searchParams: Promise<{ before?: string; cursor?: string }> }) {
  const params = await searchParams;
  return <main className={styles.page}><div className="page-shell"><Link className={styles.back} href="/catalogos">← Voltar ao site</Link><ContactList before={params.before} cursor={params.cursor} /></div></main>;
}

import type { Metadata } from "next";
import { Suspense } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AttendanceForm } from "@/components/attendance-form";
import { arcoContact } from "@/lib/catalog-data";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Atendimento comercial | ARCO Representações",
  description: "Preencha o formulário com o CNPJ, os dados da empresa e o que precisa. Depois, continue o atendimento da ARCO pelo WhatsApp.",
};

export default function AttendancePage() {
  return <>
    <SiteHeader />
    <main className={styles.page}>
      <div className={`page-shell ${styles.layout}`}>
        <aside className={styles.intro}>
          <p className="section-eyebrow">Atendimento comercial</p>
          <h1>Conte o que sua empresa precisa.</h1>
          <p>Primeiro pedido, novas linhas, reposição ou condições de compra: conte o que procura para conversar com a ARCO pelo WhatsApp.</p>
          <p>Tenha em mãos o CNPJ e os dados da empresa para preparar sua mensagem e continuar no WhatsApp.</p>
          <div className={styles.commerce}>
            <h2>Acesso para fazer pedidos</h2>
            <p>Já tem acesso liberado? Consulte preços e faça pedidos no Mercos. Para começar, solicite o acesso da empresa e aguarde a liberação.</p>
            <a className={styles.buy} href={arcoContact.orderPlatformUrl} target="_blank" rel="noopener noreferrer">Já tenho acesso: fazer pedido</a>
            <a href={arcoContact.registrationUrl} target="_blank" rel="noopener noreferrer">Solicitar acesso para comprar</a>
          </div>
        </aside>
        <div className={styles.card}>
          <Suspense fallback={<p role="status">Carregando formulário…</p>}><AttendanceForm /></Suspense>
        </div>
      </div>
    </main>
    <SiteFooter />
  </>;
}

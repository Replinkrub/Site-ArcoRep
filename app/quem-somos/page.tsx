
import SiteImage from "@/components/site-image";
import Link from "@/components/site-link";
import type { Metadata } from "next";
import { ArrowRight, Building2, MapPin, Store } from "lucide-react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { buttonVariants } from "@/components/ui/button";
import { arcoContact } from "@/lib/catalog-data";
import { attendanceUrl } from "@/lib/attendance";
import { responsiveImage } from "@/lib/responsive-images";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Quem somos | ARCO Representações",
  description:
    "Desde 2018 no varejo de Pernambuco. Conheça como a ARCO atende lojistas e indústrias, da escolha dos produtos ao planejamento da reposição.",
};

const proof = [
  { value: "2018", label: "início da ARCO" },
  { value: "1.000+", label: "clientes na base comercial" },
  { value: "5.000+", label: "itens no portfólio" },
];

export default function QuemSomosPage() {
  return (
    <>
      <SiteHeader />
      <main className={styles.page}>
        <section className={styles.hero} aria-labelledby="about-title">
          <SiteImage src="/about-retail-execution.webp" {...responsiveImage("/about-retail-execution.webp", "(max-width: 760px) 1100px, 100vw")} alt="" aria-hidden="true" className={styles.heroImage} />
          <div className={styles.heroOverlay} aria-hidden="true" />
          <div className={`page-shell ${styles.heroContent}`}>
            <p className={styles.kicker}>Quem somos</p>
            <h1 id="about-title">Quem conhece a loja representa melhor.</h1>
            <p>
              Desde 2018, representamos marcas para o varejo alimentar de Pernambuco, com foco na seção churrasco. Ajudamos sua loja a escolher as linhas, conferir as condições e planejar a reposição.
            </p>
            <Link prefetch={true} href="/catalogos" className={buttonVariants({ className: styles.primaryButton })}>Ver marcas e catálogos</Link>
          </div>
        </section>

        <section className={styles.proof} aria-label="Números da ARCO">
          <div className={`page-shell ${styles.proofGrid}`}>
            {proof.map((item) => (
              <article key={item.label}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.definition}>
          <div className={`page-shell ${styles.definitionGrid}`}>
            <div className={styles.definitionMedia}>
              <SiteImage src="/about-category-display.webp" {...responsiveImage("/about-category-display.webp", "(max-width: 760px) calc(100vw - 32px), (max-width: 900px) calc(100vw - 48px), 520px")} alt="Exposição organizada da seção churrasco em um ponto de venda" loading="lazy" decoding="async" />
              <span>Execução comercial no ponto de venda</span>
            </div>
            <div className={styles.definitionCopy}>
              <p className={styles.kicker}>Como trabalhamos</p>
              <h2>A rotina da loja orienta cada pedido.</h2>
              <p>
                Antes de indicar uma linha, buscamos entender o público, o espaço de exposição e os produtos que a loja já trabalha. Depois do pedido, acompanhamos o histórico de compras para orientar reposições e ajustes.
              </p>
              <p>
                O lojista conta com apoio na escolha e no pedido, orientação de exposição e contato comercial para tratar as demandas após a venda. Atendemos supermercados, açougues, empórios e lojas especializadas com CNPJ.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.audiences}>
          <div className="page-shell">
            <header className={styles.sectionHeading}>
              <p className={styles.kicker}>Para quem atuamos</p>
              <h2>A necessidade da loja. O mercado da indústria.</h2>
            </header>
            <div className={styles.audienceGrid}>
              <article>
                <Store aria-hidden="true" />
                <div>
                  <span>Para o varejo</span>
                  <h3>Escolher com critério. Repor com planejamento.</h3>
                  <p>Primeiro mix, novas linhas ou reposição: ajudamos a avaliar o que cabe na operação e a confirmar as condições de cada marca.</p>
                  <a className="audience-contact-link" href={arcoContact.orderPlatformUrl} target="_blank" rel="noopener noreferrer">Já tenho acesso: fazer pedido</a>
                  <a className="audience-contact-link" href={arcoContact.registrationUrl} target="_blank" rel="noopener noreferrer">Solicitar acesso para comprar</a>
                </div>
              </article>
              <article>
                <Building2 aria-hidden="true" />
                <div>
                  <span>Para a indústria</span>
                  <h3>Representação com leitura do ponto de venda.</h3>
                  <p>Uma base comercial com mais de 1.000 clientes e experiência no varejo de Pernambuco para avaliar onde o portfólio pode entrar e como acompanhar a recompra.</p>
                  <Link prefetch={true} className="audience-contact-link" href={attendanceUrl("industria")}>Conversar sobre representação</Link>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className={styles.presence}>
          <div className={`page-shell ${styles.presenceGrid}`}>
            <div>
              <p className={styles.kicker}>Presença comercial</p>
              <h2>Conhecer o mercado passa por conhecer as lojas.</h2>
            </div>
            <div className={styles.presenceCopy}>
              <MapPin aria-hidden="true" />
              <p>Veja lojas e registros do nosso trabalho em Pernambuco.</p>
              <Link prefetch={true} href="/#presenca">Ver lojas na nossa trajetória <ArrowRight /></Link>
            </div>
          </div>
        </section>

        <section className={styles.cta}>
          <div className={`page-shell ${styles.ctaGrid}`}>
            <div>
              <p>Converse com a ARCO</p>
              <h2>Vamos conversar sobre os produtos para sua loja?</h2>
            </div>
            <div className={styles.ctaActions}>
              <Link prefetch={true} href={attendanceUrl()} className={buttonVariants({ className: styles.primaryButton })}>Solicitar atendimento</Link>
              <Link prefetch={true} href="/catalogos">Ver representadas</Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

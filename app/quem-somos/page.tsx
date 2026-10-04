import type { Metadata } from "next";
import { ArrowRight, Building2, MapPin, Store } from "lucide-react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { whatsappUrl } from "@/lib/catalog-data";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Quem somos | ARCO Representações",
  description:
    "Conheça a ARCO: representação comercial B2B construída no varejo de Pernambuco desde 2018.",
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
          <img src="/about-retail-execution.webp" alt="" aria-hidden="true" className={styles.heroImage} />
          <div className={styles.heroOverlay} aria-hidden="true" />
          <div className={`page-shell ${styles.heroContent}`}>
            <p className={styles.kicker}>Quem somos</p>
            <h1 id="about-title">Representação comercial construída no varejo.</h1>
            <p>
              Desde 2018, a ARCO conecta indústrias ao varejo alimentar de Pernambuco, com alimentos, acessórios e equipamentos para a seção churrasco.
            </p>
            <Button asChild className={styles.primaryButton}>
              <a href="/catalogos">Conhecer as representadas <ArrowRight /></a>
            </Button>
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
              <img src="/about-category-display.webp" alt="Exposição organizada da seção churrasco em um ponto de venda" loading="lazy" decoding="async" />
              <span>Execução comercial no ponto de venda</span>
            </div>
            <div className={styles.definitionCopy}>
              <p className={styles.kicker}>A operação</p>
              <h2>Do mix ao acompanhamento em loja.</h2>
              <p>
                Orientamos a escolha das linhas conforme o perfil da loja, seu espaço e seu público. O atendimento continua com acompanhamento comercial, exposição no ponto de venda e planejamento de reposição.
              </p>
              <p>
                Atendemos empresas com CNPJ, como supermercados, açougues, empórios e lojas especializadas. Clientes cadastrados também podem consultar condições e fazer pedidos pelo Mercos.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.audiences}>
          <div className="page-shell">
            <header className={styles.sectionHeading}>
              <p className={styles.kicker}>Duas pontas, uma operação</p>
              <h2>Indústria e varejo conectados em Pernambuco.</h2>
            </header>
            <div className={styles.audienceGrid}>
              <article>
                <Store aria-hidden="true" />
                <div>
                  <span>Para o varejo</span>
                  <h3>Uma categoria mais fácil de comprar, expor e repor.</h3>
                  <p>Orientação na escolha de produtos, apoio no pedido e acompanhamento da exposição e da reposição.</p>
                  <a className="audience-contact-link" href={whatsappUrl("Olá, Antonio. Quero montar o mix da seção churrasco para minha loja.")} target="_blank" rel="noreferrer">Montar o mix da minha loja <ArrowRight /></a>
                </div>
              </article>
              <article>
                <Building2 aria-hidden="true" />
                <div>
                  <span>Para a indústria</span>
                  <h3>Presença de marca com leitura real do mercado.</h3>
                  <p>Relacionamento com uma base comercial de mais de 1.000 clientes e acompanhamento das oportunidades no varejo de Pernambuco.</p>
                  <a className="audience-contact-link" href={whatsappUrl("Olá, Antonio. Sou de uma indústria e quero conversar sobre representação em Pernambuco.")} target="_blank" rel="noreferrer">Conversar sobre representação <ArrowRight /></a>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className={styles.presence}>
          <div className={`page-shell ${styles.presenceGrid}`}>
            <div>
              <p className={styles.kicker}>Presença comercial</p>
              <h2>Perto da loja. Perto da oportunidade.</h2>
            </div>
            <div className={styles.presenceCopy}>
              <MapPin aria-hidden="true" />
              <p>Base em Pernambuco, com atuação comercial próxima ao varejo alimentar do estado.</p>
              <a href="/#presenca">Ver nossa presença <ArrowRight /></a>
            </div>
          </div>
        </section>

        <section className={styles.cta}>
          <div className={`page-shell ${styles.ctaGrid}`}>
            <div>
              <p>Próximo passo</p>
              <h2>Vamos construir uma oportunidade comercial juntos?</h2>
            </div>
            <div className={styles.ctaActions}>
              <Button asChild className={styles.primaryButton}>
                <a href={whatsappUrl()} target="_blank" rel="noreferrer">Falar com a ARCO <ArrowRight /></a>
              </Button>
              <a href="/catalogos">Ver representadas</a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

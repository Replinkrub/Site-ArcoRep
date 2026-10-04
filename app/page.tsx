import {
  ArrowRight,
} from "lucide-react";

import { BrandLogoRail } from "@/components/catalog/brand-logo-rail";
import { HomeMotion } from "@/components/home/home-motion";
import { FieldVideo } from "@/components/home/field-video";
import { PartnerPhotoGrid } from "@/components/home/partner-photo-grid";
import { PresenceBackground } from "@/components/home/presence-background";
import { Button } from "@/components/ui/button";
import { arcoContact, whatsappUrl } from "@/lib/catalog-data";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const stats = [
  { value: "1.000+", label: "clientes na base comercial" },
  { value: "5.000+", label: "itens no portfólio" },
];

const industryMessage = "Olá, Antonio. Sou de uma indústria e quero entender como a ARCO pode representar nossa marca no varejo de Pernambuco.";
const mixMessage = "Olá, Antonio. Quero montar o mix da seção churrasco para minha loja em Pernambuco. Podemos conversar?";

const partners = [
  {
    name: "Trevo Supermercados",
    image: "/partners/trevo.webp",
    alt: "Fachada do Trevo Supermercados.",
    position: "center",
  },
  {
    name: "Selecta Alimentos",
    image: "/partners/selecta.webp",
    alt: "Fachada da Selecta Alimentos.",
    position: "center 38%",
  },
  {
    name: "Boi Quente",
    image: "/partners/boi-quente.webp",
    alt: "Fachada do Boi Quente.",
    position: "center",
  },
  {
    name: "Masterboi",
    image: "/partners/masterboi.webp",
    alt: "Fachada de uma loja Masterboi.",
    position: "center",
  },
  {
    name: "Casa dos Ovos",
    image: "/partners/casa-dos-ovos.webp",
    alt: "Interior da Casa dos Ovos com a marca aplicada na loja.",
    position: "center 20%",
  },
  {
    name: "Pedrosa Supermercado",
    image: "/partners/pedrosa.webp",
    alt: "Fachada do Pedrosa Supermercado.",
    position: "center",
  },
];

const morePartners = [
  {
    name: "Bulltique Premium",
    image: "/partners/bulltique-premium.webp",
    alt: "Fachada da Bulltique Premium.",
    position: "center 52%",
  },
  {
    name: "Belo Bife",
    image: "/partners/belo-bife.webp",
    alt: "Fachada da Casa de Carnes Belo Bife.",
    position: "center 52%",
  },
  {
    name: "Multifrios",
    image: "/partners/multifrios.webp",
    alt: "Fachada da Multifrios.",
    position: "center 36%",
  },
  {
    name: "Carne e Queijo Cachoeirinha",
    image: "/partners/carne-queijo-cachoeirinha.webp",
    alt: "Entrada da Carne e Queijo Cachoeirinha.",
    position: "center 38%",
  },
  {
    name: "Frigorífico do Galego",
    image: "/partners/frigorifico-galego.webp",
    alt: "Fachada do Frigorífico do Galego.",
    position: "center 43%",
  },
  {
    name: "Espaço da Carne",
    image: "/partners/espaco-da-carne.webp",
    alt: "Fachada do Espaço da Carne.",
    position: "center 48%",
  },
];

const additionalPartners = [
  {
    name: "Empório das Carnes",
    image: "/partners/emporio-das-carnes.webp",
    alt: "Fachada do Empório das Carnes.",
    position: "center 45%",
  },
  {
    name: "NSC Carnes",
    image: "/partners/nsc-carnes.webp",
    alt: "Fachada da NSC Carnes.",
    position: "center 42%",
  },
  {
    name: "Comal Alimentos",
    image: "/partners/comal.webp",
    alt: "Fachada da Comal Alimentos.",
    position: "center 45%",
  },
  {
    name: "Casa de Carne Nelore",
    image: "/partners/casa-de-carne-nelore.webp",
    alt: "Fachada da Casa de Carne Nelore.",
    position: "center 45%",
  },
  {
    name: "Empório do Churrasco",
    image: "/partners/emporio-do-churrasco.webp",
    alt: "Fachada do Empório do Churrasco.",
    position: "center 27%",
  },
  {
    name: "Picanha do Gaúcho",
    image: "/partners/picanha-do-gaucho.webp",
    alt: "Fachada da Picanha do Gaúcho.",
    position: "center 48%",
  },
  {
    name: "Frigoiás",
    image: "/partners/frigoias.webp",
    alt: "Fachada da Frigoiás.",
    position: "center 30%",
  },
  {
    name: "Cavalcanti Bebidas",
    image: "/partners/cavalcanti-bebidas.webp",
    alt: "Fachada da Cavalcanti Bebidas.",
    position: "center 58%",
  },
  {
    name: "Villa Frios",
    image: "/partners/villa-frios.webp",
    alt: "Interior da Villa Frios.",
    position: "center",
  },
];

const process = [
  {
    number: "01",
    kicker: "Indústria",
    flowLabel: "Indústria",
    title: "Conhecer o portfólio",
    description: "Entender as linhas e as condições comerciais de cada marca.",
    image: "/method-origin.webp",
    imageAlt: "Mix de produtos para churrasco organizado em uma exposição real de varejo.",
  },
  {
    number: "02",
    kicker: "ARCO",
    flowLabel: "ARCO",
    title: "Escolher o mix",
    description: "Considerar o perfil da loja, o espaço e o público.",
    image: "/method-execution.webp",
    imageAlt: "Execução comercial em uma loja, com exposição de produtos para churrasco.",
  },
  {
    number: "03",
    kicker: "Ponto de venda",
    flowLabel: "Ponto de venda",
    title: "Acompanhar a execução",
    description: "Orientar a exposição e acompanhar a presença dos produtos.",
    image: "/method-pdv.webp",
    imageAlt: "Exposição organizada de temperos e produtos para churrasco no ponto de venda.",
  },
  {
    number: "04",
    kicker: "Recompra",
    flowLabel: "Recompra",
    title: "Planejar a reposição",
    description: "Ajustar o mix e a reposição conforme a necessidade da loja.",
    image: "/method-result.webp",
    imageAlt: "Exposição completa de acessórios para churrasco em loja parceira.",
  },
];

export default function Home() {
  return (
    <main id="inicio" className="itgen-home min-h-screen">
      <HomeMotion />
      <SiteHeader variant="home" />

      <section className="home-hero" aria-labelledby="home-hero-title" data-scroll-scene="hero">
        <div className="home-header-clearance" aria-hidden="true" />
        <img
          src="/category-execution.webp"
          srcSet="/category-execution-768.webp 768w, /category-execution-1024.webp 1024w, /category-execution.webp 1600w"
          sizes="(max-width: 640px) 1200px, 100vw"
          width={1600}
          height={900}
          fetchPriority="high"
          alt="Seção churrasco em loja, com temperos Cantagallo e acessórios expostos em prateleiras"
          className="home-hero-image home-hero-image--retail"
        />
        <div className="home-hero-overlay" />
        <div className="home-hero-grid" aria-hidden="true" />

        <div className="page-shell home-hero-content">
          <p className="home-kicker home-kicker--light" data-header-anchor>Representação comercial em Pernambuco</p>
          <h1 id="home-hero-title">
            O mix certo para a seção churrasco da sua loja.
          </h1>
          <p>
            Alimentos, acessórios e equipamentos de marcas representadas pela ARCO, com orientação comercial para o varejo de Pernambuco.
          </p>
          <div className="home-hero-actions">
            <Button asChild className="home-button home-button--primary">
              <a href={whatsappUrl(mixMessage)} target="_blank" rel="noreferrer">Montar o mix da minha loja <ArrowRight /></a>
            </Button>
            <Button asChild variant="outline" className="home-button home-button--ghost">
              <a href="/catalogos">Ver catálogos</a>
            </Button>
          </div>
          <small className="home-hero-eligibility">Atendimento a empresas com CNPJ.</small>
        </div>

        <div className="home-hero-marker">
          <span>01</span>
          <i />
          <small>Categoria em movimento</small>
        </div>
      </section>

      <section id="portfolio" className="home-portfolio home-section" data-reveal="fade">
        <div className="page-shell">
          <header className="home-centered-heading">
            <p className="home-kicker"><span /> Representadas <span /></p>
            <h2>Marcas para completar a seção churrasco.</h2>
            <p>Conheça as linhas de alimentos, acessórios e equipamentos para sua loja.</p>
          </header>
        </div>
        <BrandLogoRail variant="home" />
        <div className="page-shell home-portfolio-link">
          <a href="/catalogos">Ver catálogos <ArrowRight /></a>
        </div>
      </section>

      <section id="metodo" className="home-process home-section" data-scroll-scene="method" aria-labelledby="home-method-title">
        <div className="page-shell">
          <span id="atuacao" aria-hidden="true" />
          <header className="home-centered-heading">
            <p className="home-kicker"><span /> Nosso método <span /></p>
            <h2 id="home-method-title">O pedido entra. O trabalho continua.</h2>
            <p>Do portfólio da indústria à reposição na loja, cada etapa tem acompanhamento comercial.</p>
          </header>

          <div className="home-process-frame">
            <div className="home-process-viewport">
              <div className="home-process-rail" data-method-rail>
                {process.map((step, index) => {
                  return (
                    <article key={step.number} data-story-panel data-current={String(index === 0)} className="home-process-stage">
                      <figure className="home-process-visual">
                        <img
                          src={step.image}
                          alt={step.imageAlt}
                          width={1440}
                          height={900}
                          sizes="(max-width: 640px) 35vw, (max-width: 959px) 50vw, 290px"
                          loading="lazy"
                          decoding="async"
                        />
                        <span className="home-process-visual-number" aria-hidden="true">{step.number}</span>
                        <figcaption>Registro de varejo — {step.kicker}</figcaption>
                      </figure>

                      <div className="home-process-copy">
                        <span className="home-process-number" aria-hidden="true">{step.number}</span>
                        <small>{step.kicker}</small>
                        <h3>{step.title}</h3>
                        <p>{step.description}</p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="sobre" className="home-about home-section">
        <div className="page-shell home-about-grid">
          <div className="home-about-media home-about-evidence" aria-label="Registros reais da atuação da ARCO">
            <figure className="home-about-evidence-video">
              <FieldVideo />
              <figcaption>Seção churrasco em loja</figcaption>
            </figure>
            <div className="home-about-evidence-photos">
              <figure className="home-about-evidence-photo">
                <img src="/field/estoque-cantagallo.jpg" alt="Estoque de produtos Cantagallo nas prateleiras de um cliente" width={1536} height={2048} loading="lazy" decoding="async" />
                <figcaption>Estoque no cliente</figcaption>
              </figure>
              <figure className="home-about-evidence-photo home-about-evidence-photo--action">
                <img src="/field/ativacao-original.jpeg" alt="Ação Cantagallo com apresentação de produtos em uma loja" width={1200} height={1600} loading="lazy" decoding="async" />
                <figcaption>Ativação em loja</figcaption>
              </figure>
              <figure className="home-about-evidence-photo home-about-evidence-photo--display">
                <span className="home-about-evidence-photo-window">
                  <img src="/field/exposicao-original.png" alt="Produtos para churrasco organizados na seção de supermercado" width={455} height={568} loading="lazy" decoding="async" />
                </span>
                <figcaption>Exposição no PDV</figcaption>
              </figure>
            </div>
          </div>

          <div className="home-about-copy">
            <p className="home-kicker">Sobre a ARCO <span /></p>
            <h2>Representação comercial construída no varejo.</h2>
            <p>
              Desde 2018, conectamos indústrias ao varejo alimentar de Pernambuco. Nossa atuação combina orientação de mix, acompanhamento comercial e presença no ponto de venda.
            </p>
            <div className="home-about-stats" aria-label="Números da ARCO">
              {stats.map((stat) => <div key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span></div>)}
            </div>
            <div className="home-about-actions">
              <Button asChild className="home-button home-button--primary home-button--darktext">
                <a href="/quem-somos">Conheça a ARCO <ArrowRight /></a>
              </Button>
              <a className="home-industry-link" href={whatsappUrl(industryMessage)} target="_blank" rel="noreferrer">
                <span>Para indústrias</span>
                Quer levar sua marca ao varejo de Pernambuco? Converse com a ARCO. <ArrowRight aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="presenca" className="home-region home-region--network">
        <PresenceBackground />
        <div className="page-shell home-region-layout">
        <aside className="home-region-partner-network" data-partner-network aria-labelledby="home-partner-network-title">
          <header className="home-region-partner-heading">
            <p className="home-kicker home-kicker--light">Clientes</p>
            <h2 id="home-partner-network-title">Presença no varejo de Pernambuco.</h2>
            <span>Conheça algumas das lojas que fazem parte da nossa atuação comercial.</span>
          </header>
          <PartnerPhotoGrid partners={partners} morePartners={morePartners} additionalPartners={additionalPartners} />
        </aside>
        </div>
      </section>

      <section className="home-closing">
        <div className="page-shell home-closing-grid">
          <div>
            <h2>Vamos montar o mix da sua loja?</h2>
            <p className="home-closing-description">Conte para a ARCO o que você já trabalha e o que pretende ampliar.</p>
          </div>
          <div className="home-closing-actions">
            <Button asChild className="home-button home-button--primary">
              <a href={whatsappUrl(mixMessage)} target="_blank" rel="noreferrer">Montar o mix da minha loja <ArrowRight /></a>
            </Button>
            <a className="home-closing-registration" href={arcoContact.orderPlatformUrl} target="_blank" rel="noreferrer">Já é cliente? Comprar para sua loja <ArrowRight /></a>
            <a className="home-closing-registration" href={arcoContact.registrationUrl} target="_blank" rel="noreferrer">
              Precisa de acesso? Solicitar cadastro <ArrowRight />
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

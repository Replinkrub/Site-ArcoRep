
import SiteImage from "@/components/site-image";
import Link from "@/components/site-link";
import {
  ArrowRight,
} from "lucide-react";

import { BrandLogoRail } from "@/components/catalog/brand-logo-rail";
import { HomeMotion } from "@/components/home/home-motion";
import { FieldVideo } from "@/components/home/field-video";
import { PartnerPhotoGrid } from "@/components/home/partner-photo-grid";
import { PresenceBackground, PresenceMap } from "@/components/home/presence-background";
import { Button, buttonVariants } from "@/components/ui/button";
import { arcoContact } from "@/lib/catalog-data";
import { attendanceUrl } from "@/lib/attendance";
import { responsiveImage } from "@/lib/responsive-images";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { MarketsSection, WhyArco } from "@/components/brand-discovery";

const stats = [
  { value: "1.000+", label: "clientes na base comercial" },
  { value: "5.000+", label: "itens no portfólio" },
];


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
    description: "Conhecer os produtos, os pedidos mínimos e as condições de cada marca.",
    image: "/catalog/covers/orved-brock.webp",
    imageAlt: "Embaladora a vácuo Orved Brock na operação de preparo de alimentos.",
    imagePosition: "18% center",
  },
  {
    number: "02",
    kicker: "ARCO",
    flowLabel: "ARCO",
    title: "Escolher o mix",
    description: "Selecionar produtos conforme o público, o espaço e o que a loja já vende.",
    image: "/catalog/covers/monte-novo.webp",
    imageAlt: "Tábua Monte Novo em uma composição de serviço de churrasco.",
    imagePosition: "38% center",
  },
  {
    number: "03",
    kicker: "Ponto de venda",
    flowLabel: "Ponto de venda",
    title: "Cuidar da exposição",
    description: "Orientar a exposição dos produtos na loja.",
    image: "/method-pdv.webp",
    imageAlt: "Exposição organizada de temperos e produtos para churrasco no ponto de venda.",
    imagePosition: "center",
  },
  {
    number: "04",
    kicker: "Recompra",
    flowLabel: "Recompra",
    title: "Planejar a reposição",
    description: "Acompanhar o histórico de pedidos para orientar a reposição.",
    image: "/method-result.webp",
    imageAlt: "Exposição completa de acessórios para churrasco em loja parceira.",
    imagePosition: "48% center",
  },
];

// Cover crops need enough pixels for their height as well as the visible width.
// Keep wide photos generous; only the portrait cards shrink on a phone.
const methodWideSizes = "700px";
const methodPortraitSizes = "(max-width: 760px) 200px, (max-width: 959px) 50vw, 600px";

export default function Home() {
  return (
    <main id="inicio" className="itgen-home min-h-screen">
      <HomeMotion />
      <SiteHeader variant="home" />

      <section className="home-hero" aria-labelledby="home-hero-title" data-scroll-scene="hero">
        <div className="home-header-clearance" aria-hidden="true" />
        <SiteImage
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
            Alimentos, acessórios e equipamentos para supermercados, açougues e empórios. A ARCO ajuda a escolher os produtos e acompanha a reposição.
          </p>
          <div className="home-hero-actions">
            <Button asChild className="home-button home-button--primary">
              <Link href="/catalogos">Ver todos os catálogos</Link>
            </Button>
            <a href={arcoContact.orderPlatformUrl} target="_blank" rel="noopener noreferrer" className={buttonVariants({ variant: "outline", className: "home-button home-button--ghost" })}>Já tenho acesso: fazer pedido</a>
          </div>
          <div className="home-hero-access"><a href={arcoContact.registrationUrl} target="_blank" rel="noopener noreferrer">Solicitar acesso para comprar</a><Link href="/representadas">Conhecer as representadas</Link></div>
          <small className="home-hero-eligibility">Desde 2018 em Pernambuco · Atendimento a empresas com CNPJ.</small>
        </div>

        <div className="home-hero-marker">
          <span>01</span>
          <i />
          <small>Especialistas na seção churrasco</small>
        </div>
      </section>

      <section id="portfolio" className="home-portfolio home-section" data-reveal="fade">
        <div className="page-shell">
          <header className="home-centered-heading">
            <p className="home-kicker"><span /> Representadas <span /></p>
            <h2>Do tempero ao equipamento.</h2>
            <p>Conheça as linhas de cada representada ou acesse diretamente todos os catálogos.</p>
          </header>
        </div>
        <BrandLogoRail variant="home" />
        <div className="page-shell home-portfolio-link">
          <Link prefetch={true} href="/representadas">Conhecer as representadas <ArrowRight aria-hidden="true" /></Link>
          <Link prefetch={true} href="/catalogos">Ver todos os catálogos <ArrowRight aria-hidden="true" /></Link>
        </div>
      </section>

      <MarketsSection />

      <section id="metodo" className="home-process home-section" data-scroll-scene="method" aria-labelledby="home-method-title">
        <div className="page-shell">
          <span id="atuacao" aria-hidden="true" />
          <header className="home-centered-heading">
            <p className="home-kicker"><span /> Nosso método <span /></p>
            <h2 id="home-method-title">O pedido entra. O trabalho continua.</h2>
            <p>Escolha, exposição e reposição: o atendimento acompanha o caminho do produto na sua loja.</p>
          </header>

          <div className="home-process-frame">
            <div className="home-process-viewport">
              <div className="home-process-rail" data-method-rail>
                {process.map((step, index) => {
                  return (
                    <article key={step.number} data-story-panel data-current={String(index === 0)} className="home-process-stage">
                      <figure className="home-process-visual">
                        <SiteImage
                          src={step.image}
                          {...responsiveImage(step.image, index % 2 === 0 ? methodWideSizes : methodPortraitSizes)}
                          alt={step.imageAlt}
                          width={1440}
                          height={900}
                          loading="lazy"
                          decoding="async"
                          style={{ objectPosition: step.imagePosition }}
                        />
                        <span className="home-process-visual-number" aria-hidden="true">{step.number}</span>
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
                <SiteImage src="/field/estoque-cantagallo.webp" {...responsiveImage("/field/estoque-cantagallo.webp", "(max-width: 760px) 42vw, (max-width: 900px) 260px, 280px")} alt="Estoque de produtos Cantagallo nas prateleiras de um cliente" width={1536} height={2048} loading="lazy" decoding="async" />
                <figcaption>Estoque no cliente</figcaption>
              </figure>
              <figure className="home-about-evidence-photo home-about-evidence-photo--action">
                <SiteImage src="/field/ativacao-original.webp" {...responsiveImage("/field/ativacao-original.webp", "(max-width: 760px) 50vw, (max-width: 900px) 310px, 340px")} alt="Ação Cantagallo com apresentação de produtos em uma loja" width={1200} height={1600} loading="lazy" decoding="async" />
                <figcaption>Ativação em loja</figcaption>
              </figure>
              <figure className="home-about-evidence-photo home-about-evidence-photo--display">
                <span className="home-about-evidence-photo-window">
                  <SiteImage src="/field/exposicao-original.webp" {...responsiveImage("/field/exposicao-original.webp", "(max-width: 760px) 63vw, (max-width: 900px) 390px, 420px")} alt="Produtos para churrasco organizados na seção de supermercado" width={455} height={568} loading="lazy" decoding="async" />
                </span>
                <figcaption>Exposição no PDV</figcaption>
              </figure>
            </div>
          </div>

          <div className="home-about-copy">
            <p className="home-kicker">Por que escolher a ARCO <span /></p>
            <h2>Desde 2018, no dia a dia do varejo.</h2>
            <p>
              Nossa experiência vem de acompanhar o que a loja compra, como expõe e quando precisa repor. É essa leitura que orienta o atendimento da ARCO em Pernambuco.
            </p>
            <WhyArco compact />
            <div className="home-about-stats" aria-label="Números da ARCO">
              {stats.map((stat) => <div key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span></div>)}
            </div>
            <div className="home-about-actions">
              <Link prefetch={true} href="/quem-somos" className={buttonVariants({ className: "home-button home-button--primary home-button--darktext" })}>Conheça nossa atuação</Link>
              <Link prefetch={true} className="home-industry-link" href={attendanceUrl("industria")}>
                <span>Para indústrias</span>
                Vamos avaliar a representação da sua marca em Pernambuco.
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="presenca" className="home-region home-region--network">
        <PresenceBackground />
        <div className="page-shell home-region-layout">
        <aside className="home-region-partner-network" data-partner-network aria-labelledby="home-partner-network-title">
          <header className="home-region-partner-heading">
            <p className="home-kicker home-kicker--light">Lojas na nossa trajetória</p>
            <h2 id="home-partner-network-title">Nosso trabalho tem endereço.</h2>
            <span>Supermercados, açougues e empórios que fazem parte da trajetória comercial da ARCO em Pernambuco.</span>
            <PresenceMap />
          </header>
          <PartnerPhotoGrid partners={partners} morePartners={morePartners} additionalPartners={additionalPartners} />
        </aside>
        </div>
      </section>

      <section className="home-closing">
        <div className="page-shell home-closing-grid">
          <div>
            <h2>Encontre o mix para sua loja.</h2>
            <p className="home-closing-description">Conheça as marcas para o primeiro pedido, novas linhas ou reposição. Já tem acesso liberado? Consulte preços e faça pedidos no Mercos.</p>
          </div>
          <div className="home-closing-actions">
            <Button asChild className="home-button home-button--primary">
              <Link href="/catalogos">Conhecer produtos e marcas</Link>
            </Button>
            <a className="home-closing-registration" href={arcoContact.orderPlatformUrl} target="_blank" rel="noopener noreferrer">Já tenho acesso: fazer pedido</a>
            <Link prefetch={true} className="home-closing-registration" href={attendanceUrl("reposicao")}>Orientação para reposição ou novas linhas</Link>
            <a className="home-closing-registration" href={arcoContact.registrationUrl} target="_blank" rel="noreferrer">
              Solicitar acesso para comprar
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

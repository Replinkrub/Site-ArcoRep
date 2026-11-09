import { ArrowRight, ChevronDown } from "lucide-react";
import Link from "@/components/site-link";
import SiteImage from "@/components/site-image";
import { CatalogAccessButton } from "@/components/catalog/catalog-access-button";
import { attendanceUrl } from "@/lib/attendance";
import { catalogPath, type Market } from "@/lib/brand-pages";
import { arcoContact, type CatalogBrand } from "@/lib/catalog-data";
import { cantagalloApplications, cantagalloBuyingQuestions, cantagalloLines } from "@/lib/cantagallo";
import { responsiveImage } from "@/lib/responsive-images";

type Props = { brand: CatalogBrand; market?: Market };

export function CantagalloHeroProducts() {
  const selection = [cantagalloLines[0], cantagalloLines[2], cantagalloLines[3]];
  return (
    <figure className="cantagallo-hero-products">
      <SiteImage className="cantagallo-stage-logo" src="/brands/logos/cantagallo-dark.webp" alt="Empório Cantagallo" width={180} height={66} />
      <div className="cantagallo-product-stage">
        {selection.map(line => (
          <div key={line.title}>
            <SiteImage src={line.image} alt={line.alt} width={line.width} height={line.height} fetchPriority="high" />
          </div>
        ))}
      </div>
      <figcaption>Do tempero ao acompanhamento.<span>Produtos do catálogo Cantagallo.</span></figcaption>
    </figure>
  );
}

export function CantagalloShowcase({ brand, market }: Props) {
  const contact = attendanceUrl("mix", brand.slug, market?.segment);
  return (
    <>
      <section className="cantagallo-lines" aria-labelledby="cantagallo-lines-title">
        <div className="page-shell">
          <header className="cantagallo-section-heading">
            <div><p className="section-eyebrow">Explore o portfólio</p><h2 id="cantagallo-lines-title">Conheça as linhas.</h2></div>
            <p>Uma seleção para entender o portfólio. Veja todos os sabores e apresentações no catálogo.</p>
          </header>
          <div className="cantagallo-lines-grid">
            {cantagalloLines.map(line => (
              <article key={line.title}>
                <div className="cantagallo-line-image">
                  <SiteImage src={line.image} alt={line.alt} width={line.width} height={line.height} loading="lazy" decoding="async" />
                </div>
                <div className="cantagallo-line-copy"><h3>{line.title}</h3><p>{line.description}</p></div>
              </article>
            ))}
          </div>
          <div className="cantagallo-catalog-action">
            <CatalogAccessButton brand={brand} segment={market?.segment} label="Ver catálogo completo" className="discovery-catalog-button" />
            <p>Consulte a disponibilidade das linhas com a ARCO.</p>
          </div>
        </div>
      </section>

      <section className="cantagallo-retail" aria-labelledby="cantagallo-retail-title">
        <div className="page-shell cantagallo-retail-grid">
          <figure>
            <SiteImage src="/field/ativacao-original.webp" {...responsiveImage("/field/ativacao-original.webp", "(max-width: 800px) 100vw, 560px")} alt="Apresentação de produtos Cantagallo em loja, com promotora e cliente" loading="lazy" decoding="async" />
            <figcaption>Cantagallo em ação na loja<span>Registro de apresentação de produtos no varejo.</span></figcaption>
          </figure>
          <div className="cantagallo-retail-copy">
            <p className="section-eyebrow">Para o seu negócio</p>
            <h2 id="cantagallo-retail-title">O mix começa pelo perfil da sua loja.</h2>
            <p>O público, o espaço disponível e as linhas que você já vende orientam a escolha dos produtos e a exposição.</p>
            <div className="cantagallo-applications">
              {cantagalloApplications.map(application => (
                <Link key={application.market} href={catalogPath(brand.slug, application.market)}>
                  <div><h3>{application.title}</h3><p>{application.description}</p><span>Ver catálogo para este negócio</span></div>
                  <ArrowRight aria-hidden="true" />
                </Link>
              ))}
            </div>
            <Link className="brand-learn-link" href={contact}>Escolher as linhas com a ARCO <ArrowRight aria-hidden="true" /></Link>
          </div>
        </div>
      </section>

      <section className="cantagallo-buying" aria-labelledby="cantagallo-buying-title">
        <div className="page-shell cantagallo-buying-grid">
          <div><p className="section-eyebrow">Informações para comprar</p><h2 id="cantagallo-buying-title">Antes de fazer<br />o pedido.</h2><Link className="brand-learn-link" href={attendanceUrl("condicoes", brand.slug, market?.segment)}>Consultar condições da Cantagallo <ArrowRight aria-hidden="true" /></Link></div>
          <div className="cantagallo-questions">
            {cantagalloBuyingQuestions.map(item => (
              <details key={item.question}>
                <summary>{item.question}<ChevronDown aria-hidden="true" /></summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="cantagallo-order" aria-labelledby="cantagallo-order-title">
        <div className="page-shell">
          <p className="section-eyebrow">Seu próximo pedido</p>
          <h2 id="cantagallo-order-title">Leve Cantagallo<br />para a sua loja.</h2>
          <div className="cantagallo-order-options">
            <div><h3>Já tenho acesso ao Mercos</h3><p>Consulte os preços da sua empresa e envie o pedido pela plataforma.</p><a href={arcoContact.orderPlatformUrl} target="_blank" rel="noopener noreferrer">Fazer meu pedido <ArrowRight aria-hidden="true" /></a></div>
            <div><h3>Quero começar a comprar</h3><p>Solicite o acesso da empresa. Se precisar escolher as linhas, converse com a ARCO.</p><a href={arcoContact.registrationUrl} target="_blank" rel="noopener noreferrer">Solicitar acesso para comprar <ArrowRight aria-hidden="true" /></a><Link className="cantagallo-order-help" href={contact}>Preciso de orientação para o pedido</Link></div>
          </div>
          <Link className="brand-all-catalogs" href="/catalogos">Continuar vendo todos os catálogos <ArrowRight aria-hidden="true" /></Link>
        </div>
      </section>
    </>
  );
}

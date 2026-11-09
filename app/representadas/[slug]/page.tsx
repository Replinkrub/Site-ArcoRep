import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ArrowRight, Check, ChevronRight } from "lucide-react";
import Link from "@/components/site-link";
import SiteImage from "@/components/site-image";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CatalogAccessButton } from "@/components/catalog/catalog-access-button";
import { RelatedBrands, WhyArco } from "@/components/brand-discovery";
import { catalogBrands, arcoContact } from "@/lib/catalog-data";
import { brandPages, catalogPath, getMarket, markets } from "@/lib/brand-pages";
import { attendanceUrl } from "@/lib/attendance";
import { responsiveImage } from "@/lib/responsive-images";
import { CantagalloHeroProducts, CantagalloShowcase } from "@/components/cantagallo-showcase";

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ mercado?: string | string[] }> };
export function generateStaticParams() { return catalogBrands.map(brand => ({ slug: brand.slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const brand = catalogBrands.find(item => item.slug === slug);
  return brand ? { title: `${brand.name} em Pernambuco | ARCO Representações`, description: brand.description } : { title: "Marca não encontrada | ARCO" };
}

export default async function BrandPage({ params, searchParams }: Props) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  if (slug === "prime-grill") redirect("/representadas");
  const brand = catalogBrands.find(item => item.slug === slug);
  const page = brandPages[slug];
  if (!brand || !page) notFound();
  const requestedMarket = getMarket(typeof query.mercado === "string" ? query.mercado : undefined);
  const market = requestedMarket && page.markets.includes(requestedMarket.slug) ? requestedMarket : undefined;
  const attendance = attendanceUrl("mix", slug, market?.segment);
  const isCantagallo = slug === "emporio-cantagallo";
  return <><SiteHeader /><main className={`brand-landing${isCantagallo ? " brand-landing--cantagallo" : ""}`}>
    <section className="brand-hero"><div className="page-shell">
      <nav className="brand-breadcrumb" aria-label="Você está aqui"><Link href="/">Início</Link><ChevronRight aria-hidden="true" /><Link href="/representadas">Representadas</Link><ChevronRight aria-hidden="true" /><span aria-current="page">{brand.name}</span></nav>
      <div className="brand-hero-grid"><div className="brand-hero-copy"><p className="section-eyebrow">{brand.name} · Representação em Pernambuco</p><h1>{page.headline}</h1><p>{page.introduction}</p>{market && <p className="brand-market-context">Para {market.title.toLocaleLowerCase("pt-BR")}</p>}<div className="brand-hero-actions"><CatalogAccessButton brand={brand} segment={market?.segment} label={brand.catalogs.length > 1 ? "Ver catálogos da marca" : "Ver catálogo da marca"} className="discovery-catalog-button" /><Link className="brand-contact-button" href={attendance}>Conversar sobre {brand.name} <ArrowRight aria-hidden="true" /></Link></div><Link className="brand-all-catalogs" href="/catalogos">Ver todos os catálogos <ArrowRight aria-hidden="true" /></Link></div>
        {isCantagallo ? <CantagalloHeroProducts /> : <figure className={`brand-hero-media${brand.coverImage ? "" : " brand-hero-media--logo"}`}><SiteImage src={brand.coverImage ?? brand.logo!} {...responsiveImage(brand.coverImage ?? brand.logo!, "(max-width: 900px) 100vw, 650px")} alt={brand.coverAlt ?? brand.name} fetchPriority="high" /><figcaption>{brand.name}<span>{brand.coverImage ? "Conheça as linhas da representada" : "Consulte os produtos no catálogo da marca"}</span></figcaption></figure>}
      </div>
    </div></section>

    {isCantagallo ? <CantagalloShowcase brand={brand} market={market} /> : <><section className="brand-lines"><div className="page-shell"><header className="discovery-heading"><div><p className="section-eyebrow">Explore o portfólio</p><h2>Linhas para conhecer e avaliar.</h2></div><span className="brand-section-note">Confirme disponibilidade e condições com a ARCO.</span></header><div className="brand-line-grid">{page.lines.map((line, index) => <article key={line.title}><span>0{index + 1}</span><h3>{line.title}</h3><p>{line.description}</p></article>)}</div></div></section>

    <section className="brand-applications"><div className="page-shell brand-application-layout"><div><p className="section-eyebrow">Para seu negócio</p><h2>O uso e o público orientam a escolha.</h2><p>{page.guidance}</p><Link className="brand-learn-link" href={attendance}>Solicitar orientação sobre a marca <ArrowRight aria-hidden="true" /></Link></div><div className="brand-application-list">{markets.filter(item => page.markets.includes(item.slug)).map(item => <Link key={item.slug} href={catalogPath(undefined, item.slug)}><Check aria-hidden="true" /><div><h3>{item.title}</h3><span>Ver os catálogos relacionados a este negócio</span></div><ArrowRight aria-hidden="true" /></Link>)}</div></div></section>

    <section className="brand-support"><div className="page-shell"><WhyArco /></div></section>

    <section className="brand-conversion"><div className="page-shell"><div><p className="section-eyebrow">Seu próximo passo</p><h2>Conheça os produtos.<br />Converse sobre o seu pedido.</h2><p>Preços, pedido mínimo, frete e pagamento são confirmados conforme a representada e o destino.</p></div><div className="brand-conversion-actions"><CatalogAccessButton brand={brand} segment={market?.segment} label={brand.catalogs.length > 1 ? "Ver catálogos" : "Ver catálogo"} className="discovery-catalog-button" /><Link href={attendance}>Solicitar atendimento sobre {brand.name} <ArrowRight aria-hidden="true" /></Link><a href={arcoContact.orderPlatformUrl} target="_blank" rel="noopener noreferrer">Já tenho acesso: fazer pedido no Mercos</a><Link href="/catalogos">Ver todos os catálogos</Link></div></div></section>
    </>}
    <RelatedBrands slug={slug} />
  </main><SiteFooter /></>;
}

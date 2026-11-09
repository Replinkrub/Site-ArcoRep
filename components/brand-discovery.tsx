import SiteImage from "@/components/site-image";
import Link from "@/components/site-link";
import { ArrowRight, Boxes, ClipboardList, Handshake, MapPin } from "lucide-react";
import { brandPages, brandPath, brandsForMarket, catalogPath, markets } from "@/lib/brand-pages";
import { catalogBrands } from "@/lib/catalog-data";
import { responsiveImage } from "@/lib/responsive-images";

export function MarketsSection() {
  return <section id="mercados" className="discovery-markets" aria-labelledby="markets-title">
    <div className="page-shell">
      <header className="discovery-heading"><div><p className="section-eyebrow">Para o seu tipo de negócio</p><h2 id="markets-title">O que faz sentido para a sua loja?</h2></div><Link href="/catalogos">Ver todos os catálogos <ArrowRight aria-hidden="true" /></Link></header>
      <div className="discovery-market-grid">{markets.map(market => <Link key={market.slug} className="discovery-market-card" href={catalogPath(undefined, market.slug)}>
        <div className="discovery-market-photo"><SiteImage src={market.image} {...responsiveImage(market.image, "(max-width: 600px) 50vw, 320px")} alt={market.alt} loading="lazy" decoding="async" /><span>{brandsForMarket(market.slug).length} marcas</span></div>
        <div className="discovery-market-copy"><h3>{market.title}</h3><p>{market.description}</p><span>Ver catálogos para este negócio <ArrowRight aria-hidden="true" /></span></div>
      </Link>)}</div>
    </div>
  </section>;
}

const reasons = [
  { icon: ClipboardList, title: "Orientação de mix", text: "Escolha das linhas conforme o público, o espaço e o que sua loja já vende." },
  { icon: Boxes, title: "Portfólio complementar", text: "Alimentos, acessórios e equipamentos para revenda ou uso na operação." },
  { icon: Handshake, title: "Acompanhamento comercial", text: "Apoio nas demandas após o pedido e no planejamento da reposição." },
  { icon: MapPin, title: "Desde 2018 em Pernambuco", text: "Experiência de atendimento e de execução no varejo alimentar do estado." },
];

export function WhyArco({ compact = false }: { compact?: boolean }) {
  return <div className={`discovery-reasons${compact ? " discovery-reasons--compact" : ""}`}>
    {!compact && <header><p className="section-eyebrow">Por que escolher a ARCO</p><h2>Uma marca para sua loja.<br />A ARCO para acompanhar.</h2></header>}
    <div className="discovery-reason-grid">{reasons.map(reason => <article key={reason.title}><reason.icon aria-hidden="true" /><div><h3>{reason.title}</h3><p>{reason.text}</p></div></article>)}</div>
  </div>;
}

export function RelatedBrands({ slug }: { slug: string }) {
  const current = brandPages[slug];
  const related = catalogBrands.filter(brand => brand.slug !== slug && brandPages[brand.slug]?.markets.some(market => current.markets.includes(market))).slice(0, 3);
  return <section className="brand-related" aria-labelledby="related-title"><div className="page-shell">
    <header className="discovery-heading"><div><p className="section-eyebrow">Outras linhas do portfólio</p><h2 id="related-title">Continue conhecendo as representadas.</h2></div><Link href="/catalogos">Todos os catálogos <ArrowRight aria-hidden="true" /></Link></header>
    <div className="brand-related-grid">{related.map(brand => <Link key={brand.slug} href={brandPath(brand)}><span>{brand.name}</span><p>{brand.description}</p><span>Conhecer a marca <ArrowRight aria-hidden="true" /></span></Link>)}</div>
  </div></section>;
}

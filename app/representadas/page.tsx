import type { Metadata } from "next";
import Link from "@/components/site-link";
import SiteImage from "@/components/site-image";
import { ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CatalogAccessButton } from "@/components/catalog/catalog-access-button";
import { MarketsSection } from "@/components/brand-discovery";
import { catalogBrands } from "@/lib/catalog-data";
import { brandPath } from "@/lib/brand-pages";
import { responsiveImage } from "@/lib/responsive-images";

export const metadata: Metadata = { title: "Representadas | ARCO Representações", description: "Conheça as linhas de cada representada da ARCO em Pernambuco. Consulte os catálogos ou solicite orientação para sua loja." };

export default function BrandsPage() {
  return <><SiteHeader /><main className="brand-directory">
    <section className="brand-directory-intro"><div className="page-shell"><p className="section-eyebrow">Representadas ARCO</p><h1>Conheça a marca.<br /><span>Encontre o seu mix.</span></h1><p>Explore as linhas, veja aplicações para sua operação e converse com a ARCO sobre o que faz sentido para sua loja.</p><Link className="brand-all-catalogs" href="/catalogos">Já sabe o que procura? Ver todos os catálogos <ArrowRight aria-hidden="true" /></Link></div></section>
    <section className="brand-directory-list" aria-label="Marcas representadas"><div className="page-shell brand-directory-grid">{catalogBrands.map(brand => <article key={brand.slug}>
      <Link className={`brand-directory-image${brand.coverImage ? "" : " brand-directory-image--logo"}`} href={brandPath(brand)} aria-label={`Conhecer ${brand.name}`}><SiteImage src={brand.coverImage ?? brand.logo!} {...responsiveImage(brand.coverImage ?? brand.logo!, "(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 420px")} alt={brand.coverAlt ?? brand.name} loading="lazy" decoding="async" /></Link>
      <div className="brand-directory-copy"><h2><Link href={brandPath(brand)}>{brand.name}</Link></h2><p>{brand.description}</p><div><Link className="brand-learn-link" href={brandPath(brand)}>Conhecer a marca <ArrowRight aria-hidden="true" /></Link><CatalogAccessButton brand={brand} className="discovery-catalog-button" /></div></div>
    </article>)}</div></section>
    <MarketsSection />
  </main><SiteFooter /></>;
}

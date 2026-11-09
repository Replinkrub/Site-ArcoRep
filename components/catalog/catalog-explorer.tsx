"use client";

import SiteImage from "@/components/site-image";

import Link from "@/components/site-link";

import { lazy, Suspense, useMemo, useState } from "react";
import {
  ArrowRight,
  MessageCircle,
  Search,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { NativeSelect } from "@/components/ui/native-select";
import { brandPages, brandPath, getMarket, markets } from "@/lib/brand-pages";
import { attendanceUrl } from "@/lib/attendance";
import { responsiveImage } from "@/lib/responsive-images";
import { rememberedCatalogAccess, type CatalogAccess } from "@/lib/catalog-access";
import type { CatalogContact } from "@/lib/catalog-inquiry";
import {
  arcoContact,
  catalogBrands,
  catalogCategories,
  type CatalogBrand,
} from "@/lib/catalog-data";

const CatalogAccessDialog = lazy(() => import("./catalog-access-dialog"));

function BrandCard({ brand, market, onOpen }: { brand: CatalogBrand; market?: string; onOpen: (brand: CatalogBrand, trigger: HTMLButtonElement) => void }) {
  return (
      <article id={`brand-${brand.slug}`} className="catalog-brand-card">
        <div className={`catalog-brand-cover${brand.coverImage ? " catalog-brand-cover--photo" : ""}`}>
          {brand.coverImage ? (
            <SiteImage
              src={brand.coverImage}
              {...responsiveImage(brand.coverImage, "(max-width: 560px) 100vw, (max-width: 1100px) 50vw, 400px")}
              alt={brand.coverAlt ?? brand.name}
              loading="lazy"
              decoding="async"
            />
          ) : brand.logo ? (
            <SiteImage src={brand.logo} alt={brand.name} loading="lazy" decoding="async" />
          ) : (
            <strong>{brand.name.slice(0, 2).toUpperCase()}</strong>
          )}
        </div>

        <div className="catalog-brand-body">
          <div className="catalog-brand-title-row">
            <h3>{brand.name}</h3>
          </div>
          <span className="catalog-card-category">{brand.categories.map(category => catalogCategories.find(item => item.value === category)?.label).join(" · ")}</span>
          <p>{brand.description}</p>
          <div className="catalog-brand-actions">
            <Button type="button" className="catalog-open-button" onClick={event => onOpen(brand, event.currentTarget)} aria-label={`Ver ${brand.catalogs.length > 1 ? "catálogos" : "catálogo"} de ${brand.name}`}>
              {brand.catalogs.length > 1 ? "Ver catálogos (2)" : "Ver catálogo"}<ArrowRight aria-hidden="true" />
            </Button>
            <Link className="catalog-brand-learn" href={`${brandPath(brand)}${market ? `?mercado=${market}` : ""}`}>Conhecer a marca <ArrowRight aria-hidden="true" /></Link>
          </div>

          <small className="catalog-file-note">{brand.catalogs.length > 1 ? "2 arquivos PDF" : `PDF${brand.catalogs[0].fileSize ? ` · ${brand.catalogs[0].fileSize}` : ""}`}</small>
        </div>

      </article>
  );
}

const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");

export function CatalogExplorer({ initialBrand = "", initialMarket = "" }: { initialBrand?: string; initialMarket?: string }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [brandFilter, setBrandFilter] = useState(initialBrand);
  const [marketFilter, setMarketFilter] = useState(initialMarket);
  const market = getMarket(marketFilter);
  const [selected, setSelected] = useState<{ brand: CatalogBrand; access: CatalogAccess | null; trigger: HTMLButtonElement } | null>(null);
  const [contact, setContact] = useState<CatalogContact | null>(null);

  const filteredBrands = useMemo(() => {
    const normalized = normalize(query.trim());
    return catalogBrands.filter((brand) => {
      const matchesCategory = category === "all" || brand.categories.includes(category);
      const matchesSearch =
        normalized.length === 0 ||
        normalize(brand.name).includes(normalized) ||
        normalize(brand.description).includes(normalized) ||
        brand.searchTerms?.some((term) => normalize(term).includes(normalized)) ||
        brand.catalogs.some(
          (catalog) =>
            normalize(catalog.title).includes(normalized) ||
            normalize(catalog.description).includes(normalized),
        );
      const matchesBrand = !brandFilter || brand.slug === brandFilter;
      const matchesMarket = !market || brandPages[brand.slug]?.markets.includes(market.slug);
      return matchesCategory && matchesSearch && matchesBrand && matchesMarket;
    });
  }, [category, query, brandFilter, market]);

  return (
    <main className="catalog-page">
      <section className="catalog-intro" aria-labelledby="catalog-title">
        <div className="page-shell">
          <p className="section-eyebrow">Representadas ARCO</p>
          <h1 id="catalog-title">Todos os catálogos. Um só lugar.</h1>
          <p>Escolha uma marca para visualizar ou baixar o PDF. Use os filtros se quiser encontrar linhas para o seu negócio.</p>
        </div>
      </section>
      <section id="catalogos" className="catalog-explorer-section">
        <div className="page-shell">
          <h2 className="sr-only">Buscar catálogos por marca ou categoria</h2>
          <div className="catalog-controls">
            <div className="catalog-search">
              <Search aria-hidden="true" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar marca ou tipo de produto"
                aria-label="Buscar por marca ou linha de catálogo"
              />
              {query && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setQuery("")}
                  aria-label="Limpar busca"
                >
                  <X />
                </Button>
              )}
            </div>

            <ToggleGroup
              type="single"
              value={category}
              onValueChange={(value) => setCategory(value || "all")}
              variant="outline"
              spacing={2}
              className="catalog-category-group"
              aria-label="Filtrar por categoria"
            >
              {catalogCategories.map((item) => (
                <ToggleGroupItem
                  key={item.value}
                  value={item.value}
                  className="catalog-category"
                >
                  {item.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          <details className="catalog-extra-filters" open={Boolean(initialBrand || initialMarket)}>
          <summary>Filtrar por representada e tipo de negócio</summary>
          <div className="catalog-discovery-filters">
            <div><label htmlFor="catalog-brand-filter">Representada</label><NativeSelect id="catalog-brand-filter" value={brandFilter} onChange={event => setBrandFilter(event.target.value)}><option value="">Todas as marcas</option>{catalogBrands.map(brand => <option key={brand.slug} value={brand.slug}>{brand.name}</option>)}</NativeSelect></div>
            <div><label htmlFor="catalog-market-filter">Seu tipo de negócio</label><NativeSelect id="catalog-market-filter" value={marketFilter} onChange={event => setMarketFilter(event.target.value)}><option value="">Todos os negócios</option>{markets.map(item => <option key={item.slug} value={item.slug}>{item.title}</option>)}</NativeSelect></div>
          </div>
          </details>
          {(brandFilter || marketFilter || query || category !== "all") && <div className="catalog-active-filters"><span>{catalogBrands.find(brand => brand.slug === brandFilter)?.name ?? "Todas as marcas"}{market ? ` · ${market.shortTitle}` : ""}</span><Button type="button" variant="outline" onClick={() => { setBrandFilter(""); setMarketFilter(""); setQuery(""); setCategory("all"); }}>Ver todos os catálogos <X aria-hidden="true" /></Button></div>}
          {market && <div className="catalog-market-context"><div><strong>{market.title}</strong><p>{market.description}</p></div><Link href={attendanceUrl("mix", brandFilter || undefined, market.segment)}>Quero orientação para meu negócio <ArrowRight aria-hidden="true" /></Link></div>}
          <p className="catalog-result-count" aria-live="polite">
            <strong>{filteredBrands.length}</strong> {filteredBrands.length === 1 ? "marca" : "marcas"}
          </p>

          {filteredBrands.length ? (
            <div className="catalog-brand-grid" data-count={filteredBrands.length}>
              {filteredBrands.map((brand) => (
                <BrandCard key={brand.slug} brand={brand} market={market?.slug} onOpen={(brand, button) => {
                  setSelected({ brand, access: rememberedCatalogAccess() ?? (contact ? "contact" : null), trigger: button });
                }} />
              ))}
            </div>
          ) : (
            <div className="catalog-empty-state">
              <Search />
              <h3>Nenhuma marca encontrada.</h3>
              <p>Tente outro termo ou volte para todas as categorias.</p>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setQuery("");
                  setCategory("all");
                  setBrandFilter("");
                  setMarketFilter("");
                }}
              >
                Limpar filtros
              </Button>
            </div>
          )}
          <p className="catalog-search-note">Para consultar produtos específicos, abra o catálogo. Antes de fechar a compra, confirme preços, disponibilidade e condições com a ARCO.</p>
        </div>
      </section>

      {selected && <Suspense fallback={<p className="catalog-opening-status" role="status">Carregando acesso ao catálogo…</p>}>
        <CatalogAccessDialog key={selected.brand.slug} brand={selected.brand} access={selected.access} contact={contact} initialSegment={market?.segment} onContactSaved={setContact} trigger={selected.trigger} onClose={() => setSelected(null)} />
      </Suspense>}

      <section className="catalog-faq">
        <div className="page-shell catalog-faq-grid">
          <div>
            <p className="section-eyebrow">Antes do pedido</p>
            <h2>Cadastro, frete e pedido mínimo.</h2>
            <p>Entenda como comprar e quais condições precisam ser confirmadas com cada representada.</p>
          </div>
          <Link prefetch={true} className="catalog-faq-link" href="/perguntas-frequentes">Ver perguntas frequentes <ArrowRight aria-hidden="true" /></Link>
        </div>
      </section>

      <section className="catalog-final-cta">
        <div className="page-shell">
          <span className="catalog-final-icon" aria-hidden="true"><MessageCircle strokeWidth={1.75} /></span>
          <div>
            <p>Primeiro pedido com a ARCO</p>
            <h2>Vamos escolher o mix para sua loja?</h2>
            <span className="catalog-final-description">Abra o catálogo de uma marca e deixe seu contato para conversar sobre produtos e condições. Já tem cadastro? Faça seu pedido no Mercos.</span>
          </div>
          <div className="catalog-final-actions">
            <Button asChild className="catalog-contact-cta">
              <a href="#catalogos">Escolher uma marca</a>
            </Button>
            <a className="catalog-final-registration" href={arcoContact.orderPlatformUrl} target="_blank" rel="noopener noreferrer">Já tenho acesso: fazer pedido</a>
            <a className="catalog-final-registration" href={arcoContact.registrationUrl} target="_blank" rel="noreferrer">
              Solicitar acesso para comprar
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

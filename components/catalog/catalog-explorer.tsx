"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  MessageCircle,
  ExternalLink,
  Search,
  ShoppingBag,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { BrandLogoRail } from "@/components/catalog/brand-logo-rail";
import {
  arcoContact,
  catalogBrands,
  catalogCategories,
  whatsappUrl,
  type CatalogBrand,
} from "@/lib/catalog-data";

function BrandCard({ brand }: { brand: CatalogBrand }) {
  return (
      <article id={`brand-${brand.slug}`} className="catalog-brand-card">
        <div className={`catalog-brand-cover${brand.coverImage ? " catalog-brand-cover--photo" : ""}`}>
          <span>{catalogCategories.find((item) => item.value === brand.categories[0])?.label}</span>
          {brand.coverImage ? (
            <img
              src={brand.coverImage}
              alt={brand.coverAlt ?? brand.name}
              loading="lazy"
              decoding="async"
            />
          ) : brand.logo ? (
            <img src={brand.logo} alt={brand.name} loading="lazy" decoding="async" />
          ) : (
            <strong>{brand.name.slice(0, 2).toUpperCase()}</strong>
          )}
        </div>

        <div className="catalog-brand-body">
          <div className="catalog-brand-title-row">
            <h3>{brand.name}</h3>
            {brand.featured && <span>Destaque</span>}
          </div>
          <p>{brand.description}</p>
          <div className="catalog-brand-actions">
            {brand.catalogs.map((catalog) => (
              <Button asChild className="catalog-open-button" key={catalog.title}>
                <a href={catalog.href ?? whatsappUrl(brand.whatsappMessage)} target="_blank" rel="noopener noreferrer" aria-label={brand.catalogs.length > 1 ? `Ver ${catalog.title}` : `Ver catálogo de ${brand.name}`}>
                  {brand.catalogs.length > 1 ? catalog.title : "Ver catálogo"}
                  <ExternalLink aria-hidden="true" />
                </a>
              </Button>
            ))}
          </div>

          <small className="catalog-file-note">PDF · abre no Google Drive</small>
          <a
            className="catalog-ecommerce-link"
            href={arcoContact.orderPlatformUrl}
            target="_blank"
            rel="noreferrer"
          >
            <ShoppingBag /> Comprar para sua loja <ArrowRight />
          </a>
          <small className="commerce-access-note">Acesso para clientes cadastrados no Mercos</small>
        </div>

      </article>
  );
}

const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");

export function CatalogExplorer() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  const [pendingBrand, setPendingBrand] = useState<string | null>(null);

  useEffect(() => {
    if (!pendingBrand) return;
    document.getElementById(`brand-${pendingBrand}`)?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
    setPendingBrand(null);
  }, [pendingBrand]);

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
      return matchesCategory && matchesSearch;
    });
  }, [category, query]);

  function focusBrand(slug: string) {
    setQuery("");
    setCategory("all");
    setPendingBrand(slug);
  }

  return (
    <main className="catalog-page">
      <section className="catalog-intro" aria-labelledby="catalog-title">
        <div className="page-shell">
          <p className="section-eyebrow">Representadas ARCO</p>
          <h1 id="catalog-title">Catálogos para sua loja.</h1>
          <p>Explore as marcas e consulte as linhas de alimentos, acessórios e equipamentos para churrasco.</p>
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
                placeholder="Buscar marca ou linha de catálogo"
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

          <p className="catalog-search-note">A busca encontra marcas e linhas de catálogo; não consulta o conteúdo dos PDFs.</p>
          <BrandLogoRail onBrandSelect={focusBrand} />
          <p className="catalog-result-count" aria-live="polite">
            <strong>{filteredBrands.length}</strong> {filteredBrands.length === 1 ? "marca" : "marcas"}
          </p>

          {filteredBrands.length ? (
            <div className="catalog-brand-grid" data-count={filteredBrands.length}>
              {filteredBrands.map((brand) => (
                <BrandCard key={brand.slug} brand={brand} />
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
                }}
              >
                Limpar filtros
              </Button>
            </div>
          )}
        </div>
      </section>

      <section className="catalog-faq">
        <div className="page-shell catalog-faq-grid">
          <div>
            <p className="section-eyebrow">Dúvidas rápidas</p>
            <h2>Precisa de ajuda para comprar?</h2>
            <p>Reunimos as respostas sobre catálogos, cadastro, pedidos e atendimento em uma página própria.</p>
          </div>
          <a className="catalog-faq-link" href="/perguntas-frequentes">Ver perguntas frequentes <ArrowRight aria-hidden="true" /></a>
        </div>
      </section>

      <section className="catalog-final-cta">
        <div className="page-shell">
          <span className="catalog-final-icon" aria-hidden="true"><MessageCircle strokeWidth={1.75} /></span>
          <div>
            <p>Atendimento comercial</p>
            <h2>Não sabe qual catálogo olhar primeiro?</h2>
            <span className="catalog-final-description">A ARCO ajuda a montar o mix adequado para o perfil da sua loja.</span>
          </div>
          <div className="catalog-final-actions">
            <Button asChild className="catalog-contact-cta">
              <a href={whatsappUrl("Olá, Antonio. Estou consultando os catálogos da ARCO e quero ajuda para escolher as linhas para minha loja.")} target="_blank" rel="noreferrer">
                Escolher meu mix com a ARCO <ArrowRight />
              </a>
            </Button>
            <a className="catalog-final-registration" href={arcoContact.registrationUrl} target="_blank" rel="noreferrer">
              Ainda não é cliente? Solicitar cadastro
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

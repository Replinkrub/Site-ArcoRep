"use client";

import { useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLogoScroll } from "./use-logo-scroll";

import { catalogBrands } from "@/lib/catalog-data";

type BrandLogoRailProps = {
  variant?: "catalog" | "home";
  onBrandSelect?: (slug: string) => void;
};

export function BrandLogoRail({ variant = "catalog", onBrandSelect }: BrandLogoRailProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  useLogoScroll(viewportRef, paused);

  return (
    <div data-paused={paused} className={`catalog-logo-rail catalog-logo-rail--${variant}`} role="region" aria-label="Indústrias representadas">
      {variant === "catalog" && (
        <div className="page-shell catalog-logo-rail-label">
          <p>Indústrias representadas</p>
        </div>
      )}

      <div ref={viewportRef} className="catalog-logo-viewport">
        <div className="catalog-logo-track">
          {[0, 1].map((copy) => (
            <div
              key={copy}
              className={copy === 1 ? "catalog-logo-group catalog-logo-group--clone" : "catalog-logo-group"}
              aria-hidden={copy === 1 ? "true" : undefined}
            >
              {catalogBrands.map((brand) => {
                const content = (
                  <>
                    <span className="catalog-logo-art">
                      {brand.logo && <img src={brand.railLogo ?? brand.logo} alt="" loading={copy === 0 ? "eager" : "lazy"} decoding="async" />}
                    </span>
                    <span className="catalog-logo-name">{brand.name}</span>
                  </>
                );

                if (onBrandSelect) {
                  return (
                    <button
                      key={brand.slug}
                      className={`catalog-logo-item catalog-logo-item--${brand.slug}`}
                      type="button"
                      onClick={() => onBrandSelect(brand.slug)}
                      aria-label={copy === 1 ? undefined : `Ir para ${brand.name}`}
                      tabIndex={copy === 1 ? -1 : undefined}
                    >
                      {content}
                    </button>
                  );
                }

                return (
                  <a
                    key={brand.slug}
                    className={`catalog-logo-item catalog-logo-item--${brand.slug}`}
                    href={`/catalogos#brand-${brand.slug}`}
                    aria-label={copy === 1 ? undefined : `Ver catálogos de ${brand.name}`}
                    tabIndex={copy === 1 ? -1 : undefined}
                  >
                    {content}
                  </a>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="page-shell catalog-logo-controls">
        <span>Deslize para explorar as marcas</span>
        <Button variant="ghost" size="sm" className="catalog-logo-pause" onClick={() => setPaused((value) => !value)} aria-label={paused ? "Retomar movimento das marcas" : "Pausar movimento das marcas"}>
          {paused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
          {paused ? "Retomar" : "Pausar"}
        </Button>
      </div>
    </div>
  );
}

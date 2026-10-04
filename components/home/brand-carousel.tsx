"use client";

import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { catalogBrands } from "@/lib/catalog-data";

export function BrandCarousel() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api) return;
    const desktop = window.matchMedia("(min-width: 901px) and (pointer: fine)");
    const slides = api.slideNodes();
    const planes = slides.map((slide) => slide.querySelector<HTMLElement>(".home-brand-plane")!);
    let frame = 0;
    const draw = () => {
      frame = 0;
      // Read the unscaled slide boxes (including Embla's loop offsets) first.
      const viewport = api.rootNode().getBoundingClientRect();
      const center = viewport.left + viewport.width / 2;
      const distances = slides.map((slide) => {
        const rect = slide.getBoundingClientRect();
        return Math.max(-1, Math.min(1, (rect.left + rect.width / 2 - center) / rect.width));
      });
      planes.forEach((plane, index) => {
        const distance = distances[index];
        const depth = Math.abs(distance);
        plane.style.transform = reducedMotion ? "none" : desktop.matches
          ? `perspective(1400px) translateY(${depth * 10}px) rotateY(${-distance * 8}deg) scale(${1 - depth * 0.08})`
          : `translateY(${depth * 4}px) scale(${1 - depth * 0.055})`;
      });
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(draw); };
    api.on("scroll", schedule).on("reInit", schedule).on("settle", schedule);
    desktop.addEventListener("change", schedule);
    draw();
    return () => {
      cancelAnimationFrame(frame);
      api.off("scroll", schedule).off("reInit", schedule).off("settle", schedule);
      desktop.removeEventListener("change", schedule);
      planes.forEach((plane) => plane.style.removeProperty("transform"));
    };
  }, [api, reducedMotion]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  return (
    <Carousel
      className="home-brand-carousel"
      setApi={setApi}
      opts={{ align: "center", loop: true, duration: reducedMotion ? 0 : 28 }}
      aria-label="Representadas ARCO"
    >
      <CarouselContent>
        {catalogBrands.map((brand, index) => (
          <CarouselItem
            key={brand.slug}
            className="basis-[88%] sm:basis-1/2 lg:basis-1/3"
          >
            <div className="home-brand-plane">
            <a href={`/catalogos#brand-${brand.slug}`} className="home-brand-slide">
              <div className={`home-brand-art home-brand-art--${(index % 3) + 1}`}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {brand.logo ? (
                  <img src={brand.logo} alt={brand.name} loading="lazy" decoding="async" width={250} height={125} />
                ) : (
                  <strong>{brand.name.slice(0, 2).toUpperCase()}</strong>
                )}
              </div>
              <div className="home-brand-copy">
                <div>
                  <small>{brand.categories[0]?.replaceAll("-", " ")}</small>
                  <h3>{brand.name}</h3>
                </div>
                <ArrowRight aria-hidden="true" />
              </div>
            </a>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="home-carousel-control home-carousel-control--prev" aria-label="Marca anterior" />
      <CarouselNext className="home-carousel-control home-carousel-control--next" aria-label="Próxima marca" />
    </Carousel>
  );
}

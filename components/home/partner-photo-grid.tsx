"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type PartnerPhoto = {
  name: string;
  image: string;
  alt: string;
  position: string;
};

type PartnerPhotoGridProps = {
  partners: PartnerPhoto[];
  morePartners: PartnerPhoto[];
  additionalPartners: PartnerPhoto[];
};

export function PartnerPhotoGrid({ partners, morePartners, additionalPartners }: PartnerPhotoGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [turns, setTurns] = useState(() => partners.map(() => 0));
  const photosByTile = useMemo(() => partners.map((partner, tile) => [
    partner,
    morePartners[tile],
    ...additionalPartners.filter((_, index) => index % partners.length === tile),
  ]), [partners, morePartners, additionalPartners]);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || typeof IntersectionObserver === "undefined") return;

    let startTimer: number | undefined;
    let changeTimer: number | undefined;
    let nextTile = 0;
    let visible = false;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const stop = () => {
      window.clearTimeout(startTimer);
      window.clearInterval(changeTimer);
      startTimer = undefined;
      changeTimer = undefined;
    };

    const sync = () => {
      if (!visible || reduced.matches || document.hidden) {
        stop();
        return;
      }
      if (startTimer !== undefined || changeTimer !== undefined) return;
      // Let the existing entrance animation settle before a photo changes.
      startTimer = window.setTimeout(() => {
        startTimer = undefined;
        changeTimer = window.setInterval(() => {
          const tile = nextTile;
          setTurns((current) => current.map((value, index) => index === tile ? value + 1 : value));
          nextTile = (nextTile + 1) % partners.length;
        }, 1700);
      }, 2600);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    }, { threshold: 0.15 });

    observer.observe(grid);
    reduced.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect(); stop();
      reduced.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, [partners.length]);

  return (
    <div ref={gridRef} className="home-region-partner-grid" role="list" aria-label="Clientes parceiros da ARCO">
      {partners.map((partner, index) => {
        const photos = photosByTile[index];
        const active = photos[turns[index] % photos.length];
        const upcoming = photos[(turns[index] + 1) % photos.length];
        const showNext = turns[index] % 2 === 1;
        const firstFrame = showNext ? upcoming : active;
        const secondFrame = showNext ? active : upcoming;
        return (
          <article
            key={partner.name}
            className="home-region-partner-tile"
            data-partner-tile
            role="listitem"
            aria-label={active.name}
          >
            <div className="home-region-partner-tile-inner" data-swapped={showNext ? "true" : "false"}>
              <div className="home-region-partner-frame home-region-partner-frame--original" aria-hidden={showNext}>
                <img src={firstFrame.image} alt="" loading="lazy" decoding="async" style={{ objectPosition: firstFrame.position }} />
                <span className="home-region-partner-label">{firstFrame.name}</span>
              </div>
              <div className="home-region-partner-frame home-region-partner-frame--next" aria-hidden={!showNext}>
                <img src={secondFrame.image} alt="" loading="lazy" decoding="async" style={{ objectPosition: secondFrame.position }} />
                <span className="home-region-partner-label">{secondFrame.name}</span>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

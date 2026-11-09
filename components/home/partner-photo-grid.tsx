"use client";

import SiteImage from "@/components/site-image";
import { Pause, Play } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { responsiveImage } from "@/lib/responsive-images";

type PartnerPhoto = { name: string; image: string; alt: string; position: string };
type PartnerPhotoGridProps = { partners: PartnerPhoto[]; morePartners: PartnerPhoto[]; additionalPartners: PartnerPhoto[] };

function PartnerTile({ photos, turn, index, paused }: { photos: PartnerPhoto[]; turn: number; index: number; paused: boolean }) {
  const [buffer, setBuffer] = useState<{ front: 0 | 1; frames: [PartnerPhoto, PartnerPhoto] }>(() => ({ front: 0, frames: [photos[0], photos[0]] }));
  const target = photos[turn % photos.length];
  const sizes = index === 0
    ? "(max-width: 900px) calc(50vw - 28px), (max-width: 1230px) 40vw, 440px"
    : "(max-width: 900px) calc(50vw - 28px), (max-width: 1230px) 20vw, 220px";

  useEffect(() => {
    if (paused || turn === 0) return;
    let cancelled = false;
    const preload = new Image();
    const hints = responsiveImage(target.image, sizes);
    // Decode the incoming photo before fading it in. The visible layer keeps
    // its source throughout the transition, including on a slow connection.
    if (hints.sizes) preload.sizes = hints.sizes;
    if (hints.srcSet) preload.srcset = hints.srcSet;
    preload.src = target.image;
    preload.decode().then(() => {
      if (cancelled) return;
      setBuffer((current) => {
        if (current.frames[current.front].image === target.image) return current;
        const front = current.front === 0 ? 1 : 0;
        const frames: [PartnerPhoto, PartnerPhoto] = [...current.frames];
        frames[front] = target;
        return { front, frames };
      });
    }).catch(() => {
      // A failed incoming asset must never blank the current photo.
    });
    return () => { cancelled = true; };
  }, [target, turn, sizes, paused]);

  return (
    <article className="home-region-partner-tile" data-partner-tile role="listitem" aria-label={buffer.frames[buffer.front].name}>
      <div className="home-region-partner-tile-inner" data-swapped={buffer.front === 1 ? "true" : "false"}>
        {buffer.frames.map((photo, frame) => (
          <div key={frame} className={`home-region-partner-frame home-region-partner-frame--${frame === 0 ? "original" : "next"}`} aria-hidden={buffer.front !== frame}>
            <SiteImage src={photo.image} {...responsiveImage(photo.image, sizes)} alt="" loading="lazy" decoding="async" style={{ objectPosition: photo.position }} />
            <span className="home-region-partner-label">{photo.name}</span>
          </div>
        ))}
      </div>
    </article>
  );
}

export function PartnerPhotoGrid({ partners, morePartners, additionalPartners }: PartnerPhotoGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [turns, setTurns] = useState(() => partners.map(() => 0));
  const [paused, setPaused] = useState(false);
  const photosByTile = useMemo(() => partners.map((partner, tile) => [
    partner, morePartners[tile],
    ...additionalPartners.filter((_, index) => index % partners.length === tile),
  ].filter((photo): photo is PartnerPhoto => Boolean(photo))), [partners, morePartners, additionalPartners]);

  useEffect(() => {
    const section = gridRef.current?.closest<HTMLElement>(".home-region--network");
    if (!section) return;
    section.dataset.presencePaused = String(paused);
    section.dispatchEvent(new Event("presence-motion-change"));
    return () => { delete section.dataset.presencePaused; };
  }, [paused]);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || paused || partners.length === 0 || typeof IntersectionObserver === "undefined") return;
    let startTimer: number | undefined;
    let changeTimer: number | undefined;
    let nextTile = 0;
    let visible = false;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const stop = () => {
      window.clearTimeout(startTimer); window.clearInterval(changeTimer);
      startTimer = undefined; changeTimer = undefined;
    };
    const sync = () => {
      if (!visible || reduced.matches || document.hidden) { stop(); return; }
      if (startTimer !== undefined || changeTimer !== undefined) return;
      startTimer = window.setTimeout(() => {
        startTimer = undefined;
        changeTimer = window.setInterval(() => {
          const tile = nextTile;
          setTurns((current) => current.map((value, index) => index === tile ? value + 1 : value));
          nextTile = (nextTile + 1) % partners.length;
        }, 2600);
      }, 3200);
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }, { threshold: 0.05 });
    observer.observe(grid);
    reduced.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect(); stop();
      reduced.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, [partners.length, paused]);

  return (
    <div className="home-presence-gallery">
      <div ref={gridRef} className="home-region-partner-grid" role="list" aria-label="Lojas na trajetória comercial da ARCO">
        {photosByTile.map((photos, index) => <PartnerTile key={photos[0].name} photos={photos} turn={turns[index]} index={index} paused={paused} />)}
      </div>
      <div className="home-presence-gallery-footer">
        <span>Registros da nossa trajetória</span>
        <button className="home-presence-pause" type="button" aria-pressed={paused} onClick={() => setPaused((current) => !current)}>
          {paused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
          {paused ? "Retomar movimento" : "Pausar movimento"}
        </button>
      </div>
    </div>
  );
}

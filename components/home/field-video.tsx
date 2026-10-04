"use client";

import { useEffect, useRef } from "react";

export function FieldVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    const sync = () => {
      if (reducedMotion.matches || !visible || document.hidden) video.pause();
      else void video.play().catch(() => {});
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    }, { threshold: 0.25 });
    observer.observe(video);
    reducedMotion.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      reducedMotion.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  return (
    <video
      ref={videoRef}
      className="home-about-video-element"
      src="/field/secao-churrasco.mp4"
      poster="/field/secao-churrasco-poster.jpg"
      aria-label="Vídeo de uma seção churrasco montada em loja, com produtos, acessórios e equipamentos"
      width={576}
      height={1024}
      muted
      loop
      playsInline
      controls
      preload="metadata"
    />
  );
}

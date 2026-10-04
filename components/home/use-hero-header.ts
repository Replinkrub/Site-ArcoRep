"use client";

import { useLayoutEffect, useRef, useState } from "react";

/** Functional navigation stays active even when decorative motion is disabled. */
export function useHeroHeader(enabled: boolean) {
  const headerRef = useRef<HTMLElement>(null);
  const [compact, setCompact] = useState(false);

  useLayoutEffect(() => {
    const header = headerRef.current;
    const root = header?.closest<HTMLElement>(".itgen-home");
    const anchor = root?.querySelector<HTMLElement>("[data-header-anchor]");
    const clearance = root?.querySelector<HTMLElement>(".home-header-clearance");
    if (!enabled || !header || !root || !anchor || !clearance) return;

    let observer: IntersectionObserver | undefined;
    let raf = 0;
    let previousHeight = 0;

    function publishHeight(height: number) {
      const rounded = Math.ceil(height);
      if (rounded !== previousHeight) {
        previousHeight = rounded;
        root!.style.setProperty("--home-header-height", `${rounded}px`);
      }
    }

    function observeBoundary() {
      raf = 0;
      observer?.disconnect();
      // The initial clearance never shrinks with the header: no feedback loop
      // or oscillation when scrolling back across the same boundary.
      const cutoff = clearance!.getBoundingClientRect().height + 24;
      publishHeight(header!.getBoundingClientRect().height);
      if (typeof IntersectionObserver === "undefined") {
        setCompact(true);
        return;
      }
      setCompact(anchor!.getBoundingClientRect().bottom <= cutoff);
      observer = new IntersectionObserver(([entry]) => {
        setCompact(entry.boundingClientRect.bottom <= cutoff);
      }, { rootMargin: `-${cutoff}px 0px 0px 0px`, threshold: 0 });
      observer.observe(anchor!);
    }

    function refresh() {
      if (!raf) raf = requestAnimationFrame(observeBoundary);
    }

    const resizeObserver = typeof ResizeObserver !== "undefined"
      ? new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.target === header) {
            publishHeight(entry.borderBoxSize?.[0]?.blockSize ?? header.getBoundingClientRect().height);
          } else refresh();
        }
      }) : undefined;
    resizeObserver?.observe(header);
    resizeObserver?.observe(clearance);
    observeBoundary();
    window.addEventListener("resize", refresh, { passive: true });
    window.addEventListener("pageshow", refresh);
    window.addEventListener("hashchange", refresh);
    return () => {
      cancelAnimationFrame(raf);
      observer?.disconnect();
      resizeObserver?.disconnect();
      window.removeEventListener("resize", refresh);
      window.removeEventListener("pageshow", refresh);
      window.removeEventListener("hashchange", refresh);
      root.style.removeProperty("--home-header-height");
    };
  }, [enabled]);

  return { headerRef, compact };
}

"use client";

import { useEffect, type RefObject } from "react";

/** Native horizontal scrolling keeps touch gestures and links functional. */
export function useLogoScroll(viewportRef: RefObject<HTMLDivElement | null>, paused: boolean) {
  useEffect(() => {
    const viewport = viewportRef.current;
    const group = viewport?.querySelector<HTMLElement>(".catalog-logo-group");
    if (!viewport || !group) return;
    const mobile = window.matchMedia("(max-width: 760px), (pointer: coarse)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let touching = false;
    let focused = false;
    let resumeAt = 0;
    let frame = 0;
    let previous = 0;
    let position = viewport.scrollLeft;
    let cycle = group.getBoundingClientRect().width;

    const eligible = () => mobile.matches && !reduced.matches && !paused && visible && !document.hidden;
    function tick(time: number) {
      frame = 0;
      if (!eligible()) return;
      const delta = previous ? Math.min(time - previous, 50) : 0;
      previous = time;
      if (touching || focused || time < resumeAt) {
        position = viewport!.scrollLeft;
      } else if (cycle > 0) {
        position += delta * 0.024;
        // Both groups have identical width: wrap without a visible jump.
        position %= cycle;
        viewport!.scrollLeft = position;
      }
      frame = requestAnimationFrame(tick);
    }
    function sync() {
      cancelAnimationFrame(frame);
      frame = 0;
      previous = 0;
      if (!mobile.matches && !reduced.matches) viewport!.scrollLeft = 0;
      position = viewport!.scrollLeft;
      if (eligible()) frame = requestAnimationFrame(tick);
    }
    function startTouch() { touching = true; }
    function endTouch() { touching = false; resumeAt = performance.now() + 2500; }
    function wheel() { resumeAt = performance.now() + 2500; }
    function focusIn() { focused = true; }
    function focusOut(event: FocusEvent) {
      focused = event.relatedTarget instanceof Node && viewport!.contains(event.relatedTarget);
      resumeAt = performance.now() + 2500;
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    }, { threshold: 0.1 });
    observer.observe(viewport);
    const resize = new ResizeObserver(() => {
      cycle = group.getBoundingClientRect().width;
      sync();
    });
    resize.observe(group);
    viewport.addEventListener("pointerdown", startTouch, { passive: true });
    window.addEventListener("pointerup", endTouch, { passive: true });
    window.addEventListener("pointercancel", endTouch, { passive: true });
    viewport.addEventListener("wheel", wheel, { passive: true });
    viewport.addEventListener("focusin", focusIn);
    viewport.addEventListener("focusout", focusOut);
    document.addEventListener("visibilitychange", sync);
    mobile.addEventListener("change", sync);
    reduced.addEventListener("change", sync);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      resize.disconnect();
      viewport.removeEventListener("pointerdown", startTouch);
      window.removeEventListener("pointerup", endTouch);
      window.removeEventListener("pointercancel", endTouch);
      viewport.removeEventListener("wheel", wheel);
      viewport.removeEventListener("focusin", focusIn);
      viewport.removeEventListener("focusout", focusOut);
      document.removeEventListener("visibilitychange", sync);
      mobile.removeEventListener("change", sync);
      reduced.removeEventListener("change", sync);
    };
  }, [paused, viewportRef]);
}

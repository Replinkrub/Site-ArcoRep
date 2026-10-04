"use client";

import { useEffect } from "react";

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/** Progressive enhancement: the server-rendered page is complete without motion. */
export function HomeMotion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".itgen-home");
    if (!root || typeof IntersectionObserver === "undefined" || typeof ResizeObserver === "undefined") return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const depth = window.matchMedia("(min-width: 901px) and (pointer: fine)");
    const methodHorizontal = window.matchMedia("(min-width: 960px) and (pointer: fine)");
    let dispose = () => {};

    function setup() {
      dispose();
      if (!root || reduced.matches) return;

      const scenes = [...root.querySelectorAll<HTMLElement>("[data-scroll-scene]")];
      const reveals = [...root.querySelectorAll<HTMLElement>("[data-reveal]")];
      const method = root.querySelector<HTMLElement>(".home-process")!;
      const methodViewport = method.querySelector<HTMLElement>(".home-process-viewport")!;
      const rail = method.querySelector<HTMLElement>("[data-method-rail]")!;
      const panels = [...method.querySelectorAll<HTMLElement>("[data-story-panel]")];
      const region = root.querySelector<HTMLElement>(".home-region")!;
      const partnerNetwork = region.querySelector<HTMLElement>("[data-partner-network]");
      const moving = [...root.querySelectorAll<HTMLElement>(
        ".home-hero-image, .home-hero-grid, .home-about-photo img, .home-region-map, .home-region-graphic, .home-region-partner-network, .home-manifesto-rule > i",
      )];
      const sceneLayers = new Map(scenes.map((scene) => [scene, moving.filter((layer) => scene.contains(layer))]));
      const visibleScenes = new Set<HTMLElement>();
      let raf = 0;
      let needsMeasure = true;
      let methodMaxShift = 0;
      let activeStep = -1;
      let methodEntranceTimer = 0;
      let partnerEntranceTimer = 0;
      const horizontalEnabled = methodHorizontal.matches;
      const hasScrollMotion = depth.matches || horizontalEnabled;

      root.dataset.motion = "ready";
      if (horizontalEnabled) method.dataset.methodHorizontal = "true";

      // Only prepare offscreen groups; never hide content already being read.
      const pendingReveals = reveals.filter((el) => (depth.matches || !el.classList.contains("home-service-grid")) && el.getBoundingClientRect().top > window.innerHeight * 0.95);
      pendingReveals.forEach((el) => { el.dataset.revealState = "pending"; });
      const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).dataset.revealState = "visible";
            revealObserver.unobserve(entry.target);
          }
        });
      }, { rootMargin: "0px 0px -5% 0px", threshold: 0.05 });
      pendingReveals.forEach((el) => revealObserver.observe(el));

      // The method cards only animate in when they are genuinely offscreen.
      // This keeps deep links and reloads in the middle of the page readable.
      const methodIsOffscreen = methodViewport.getBoundingClientRect().top > window.innerHeight * 0.95;
      const methodEntranceObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          method.dataset.methodEntrance = "visible";
          window.clearTimeout(methodEntranceTimer);
          methodEntranceTimer = window.setTimeout(() => {
            if (method.dataset.methodEntrance === "visible") method.dataset.methodEntrance = "complete";
          }, 720);
          methodEntranceObserver.unobserve(entry.target);
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });

      if (methodIsOffscreen && depth.matches) {
        method.dataset.methodEntrance = "pending";
        methodEntranceObserver.observe(methodViewport);
      } else {
        method.dataset.methodEntrance = "complete";
      }

      // Stacked cards must enter individually: a group reveal finishes before
      // the lower cards reach a phone's viewport.
      const mobileCards = depth.matches ? [] : [...root.querySelectorAll<HTMLElement>(".home-service-card, .home-process-stage")];
      const mobileObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          (entry.target as HTMLElement).dataset.mobileEntry = "visible";
          mobileObserver.unobserve(entry.target);
        });
      }, { threshold: 0.12 });
      mobileCards.forEach((card) => {
        if (card.getBoundingClientRect().top < window.innerHeight * 0.95) return;
        card.dataset.mobileEntry = "pending";
        mobileObserver.observe(card);
      });

      // The partner network uses a one-time convergence, never a scroll-controlled animation.
      // It stays fully visible if JavaScript is unavailable or the section is opened directly.
      let partnerObserver: IntersectionObserver | undefined;
      if (partnerNetwork) {
        const partnerIsOffscreen = partnerNetwork.getBoundingClientRect().top > window.innerHeight * 0.95;
        partnerObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            partnerNetwork.dataset.partnerState = "entering";
            window.clearTimeout(partnerEntranceTimer);
            partnerEntranceTimer = window.setTimeout(() => {
              if (partnerNetwork.dataset.partnerState === "entering") partnerNetwork.dataset.partnerState = "ready";
            }, 1080);
            partnerObserver?.unobserve(entry.target);
          });
        }, { threshold: 0.18 });

        if (partnerIsOffscreen) {
          partnerNetwork.dataset.partnerState = "pending";
          partnerObserver.observe(partnerNetwork);
        } else {
          partnerNetwork.dataset.partnerState = "ready";
        }
      }

      function draw() {
        raf = 0;
        if (document.hidden) return;
        const viewportHeight = window.innerHeight;

        // Batch geometry reads before any transform/attribute writes.
        const measurements = [...visibleScenes].map((scene) => ({ scene, rect: scene.getBoundingClientRect() }));
        if (needsMeasure) {
          if (horizontalEnabled) {
            const availableShift = Math.max(0, rail.scrollWidth - methodViewport.clientWidth);
            methodMaxShift = availableShift;
          }
          needsMeasure = false;
        }

        for (const { scene, rect } of measurements) {
          const name = scene.dataset.scrollScene;
          if (name === "method") {
            if (!horizontalEnabled) continue;
            const viewportRect = methodViewport.getBoundingClientRect();
            const start = viewportHeight * 0.86;
            const finish = viewportHeight * 0.16;
            const progress = clamp((start - viewportRect.top) / Math.max(1, start - finish), 0, 1);
            const easedProgress = progress * (2 - progress);
            const step = Math.min(3, Math.floor(progress * 4));
            rail.style.transform = `translate3d(${-methodMaxShift * easedProgress}px, 0, 0)`;
            if (step !== activeStep) {
              activeStep = step;
              panels.forEach((panel, index) => { panel.dataset.current = String(index === step); });
            }
            continue;
          }

          if (!depth.matches) continue;
          const layers = sceneLayers.get(scene)!;
          const centerDistance = viewportHeight / 2 - rect.top - rect.height / 2;
          if (name === "hero") {
            const offset = clamp(-rect.top * 0.12, 0, 90);
            layers[0].style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
            layers[1].style.transform = `translate3d(0, ${(offset * 0.35).toFixed(2)}px, 0)`;
          } else if (name === "about") {
            layers[0].style.transform = `translate3d(0, ${clamp(centerDistance * 0.12, -64, 64).toFixed(2)}px, 0)`;
          } else if (name === "region") {
            layers[0].style.transform = `translate3d(0, ${clamp(centerDistance * 0.06, -30, 30).toFixed(2)}px, 0)`;
            layers[1].style.transform = `translate3d(0, ${clamp(centerDistance * 0.025, -12, 12).toFixed(2)}px, 0)`;
            if (layers[2]) {
              const partnerY = clamp(centerDistance * 0.014, -6, 6);
              const partnerX = clamp(centerDistance * -0.018, -8, 8);
              layers[2].style.transform = `translate3d(${partnerX.toFixed(2)}px, ${partnerY.toFixed(2)}px, 0)`;
            }
          } else if (name === "manifesto") {
            const progress = clamp((viewportHeight * 0.88 - rect.top) / (rect.height * 0.75), 0, 1);
            layers[0].style.transform = `scaleX(${progress})`;
          }
        }
      }

      function schedule() {
        if (!raf && !document.hidden) raf = window.requestAnimationFrame(draw);
      }
      function measure() {
        needsMeasure = true;
        schedule();
      }

      const sceneObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const scene = entry.target as HTMLElement;
          if (entry.isIntersecting) visibleScenes.add(scene);
          else visibleScenes.delete(scene);
          scene.dataset.sceneActive = String(entry.isIntersecting);
        });
        schedule();
      }, { rootMargin: "80px 0px", threshold: 0 });
      scenes.forEach((scene) => {
        if (depth.matches || (horizontalEnabled && scene === method)) sceneObserver.observe(scene);
      });

      // Event-driven frames, never a continuous animation loop or wheel interception.
      const onScroll = () => { if (visibleScenes.size) schedule(); };
      if (hasScrollMotion) window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", measure, { passive: true });
      document.addEventListener("visibilitychange", schedule);
      const resizeObserver = new ResizeObserver(measure);
      resizeObserver.observe(root);
      resizeObserver.observe(methodViewport);
      schedule();

      dispose = () => {
        window.cancelAnimationFrame(raf);
        window.clearTimeout(methodEntranceTimer);
        window.clearTimeout(partnerEntranceTimer);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", measure);
        document.removeEventListener("visibilitychange", schedule);
        sceneObserver.disconnect();
        revealObserver.disconnect();
        methodEntranceObserver.disconnect();
        mobileObserver.disconnect();
        mobileCards.forEach((card) => { delete card.dataset.mobileEntry; });
        partnerObserver?.disconnect();
        resizeObserver.disconnect();
        delete root!.dataset.motion;
        delete method.dataset.methodHorizontal;
        delete method.dataset.methodEntrance;
        if (partnerNetwork) delete partnerNetwork.dataset.partnerState;
        reveals.forEach((el) => { delete el.dataset.revealState; });
        scenes.forEach((el) => { delete el.dataset.sceneActive; });
        panels.forEach((el) => { delete el.dataset.current; });
        [...moving, rail].forEach((el) => { el.style.removeProperty("transform"); });
      };
    }

    setup();
    [reduced, depth, methodHorizontal].forEach((query) => query.addEventListener("change", setup));
    return () => {
      dispose();
      [reduced, depth, methodHorizontal].forEach((query) => query.removeEventListener("change", setup));
    };
  }, []);

  return null;
}

"use client";

import { useEffect, useRef } from "react";

import { PERNAMBUCO_OUTLINE } from "./pernambuco-outline";

type NetworkPoint = {
  x: number;
  y: number;
  phase: number;
  hub: boolean;
};

function halton(index: number, base: number) {
  let result = 0;
  let fraction = 1 / base;
  while (index > 0) {
    result += fraction * (index % base);
    index = Math.floor(index / base);
    fraction /= base;
  }
  return result;
}

function isInsideMap(x: number, y: number) {
  let inside = false;
  for (let i = 0, j = PERNAMBUCO_OUTLINE.length - 1; i < PERNAMBUCO_OUTLINE.length; j = i++) {
    const [xi, yi] = PERNAMBUCO_OUTLINE[i];
    const [xj, yj] = PERNAMBUCO_OUTLINE[j];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

const NETWORK_NODES: NetworkPoint[] = (() => {
  const points: NetworkPoint[] = [];
  for (let i = 1; points.length < 56 && i < 800; i++) {
    const x = halton(i, 2);
    const y = halton(i, 3);
    if (!isInsideMap(x, y)) continue;
    points.push({ x, y, phase: points.length * 1.73, hub: points.length % 11 === 0 });
  }
  return points;
})();

/** Decorative relationships, never geographic coordinates. */
export function PresenceBackground() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const motion = matchMedia("(prefers-reduced-motion: no-preference)");
    const compact = matchMedia("(max-width: 900px), (pointer: coarse)");
    let visible = false;
    let frame = 0;
    let last = 0;
    let elapsed = 0;
    let revealStartedAt = 0;
    let width = 1;
    let height = 1;
    let terminals: Array<{ x: number; y: number; phase: number }> = [];

    function getMapRect(isCompact: boolean) {
      const aspect = 3.06;
      if (isCompact) {
        const mapWidth = width * 0.92;
        const mapHeight = mapWidth / aspect;
        const firstTileY = terminals.length ? Math.min(...terminals.map((point) => point.y)) : height * 0.62;
        return { x: (width - mapWidth) / 2, y: Math.max(height * 0.38, firstTileY - mapHeight - 34), width: mapWidth, height: mapHeight };
      }
      const mapWidth = Math.min(width * 0.87, height * 2.85);
      const mapHeight = mapWidth / aspect;
      return { x: width - mapWidth - width * 0.015, y: (height - mapHeight) * 0.45, width: mapWidth, height: mapHeight };
    }

    function getMapPath(rect: ReturnType<typeof getMapRect>) {
      const path = new Path2D();
      PERNAMBUCO_OUTLINE.forEach(([x, y], index) => {
        const px = rect.x + x * rect.width;
        const py = rect.y + y * rect.height;
        if (index === 0) path.moveTo(px, py);
        else path.lineTo(px, py);
      });
      path.closePath();
      return path;
    }

    function draw(now = performance.now()) {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      const isCompact = compact.matches;
      const reduceMotion = !motion.matches;
      const reveal = reduceMotion || !revealStartedAt
        ? 1
        : Math.min(1, (now - revealStartedAt) / 850);
      const rect = getMapRect(isCompact);
      const mapPath = getMapPath(rect);
      const nodeCount = isCompact ? 34 : 52;
      const range = isCompact ? Math.min(88, rect.width * 0.24) : Math.min(178, rect.width * 0.17);
      const points = NETWORK_NODES.slice(0, nodeCount).map((n, index) => ({
        x: rect.x + n.x * rect.width + Math.sin(elapsed * (0.48 + (index % 3) * 0.04) + n.phase) * (isCompact ? 4 : 9),
        y: rect.y + n.y * rect.height + Math.cos(elapsed * (0.37 + (index % 4) * 0.025) + n.phase) * (isCompact ? 3 : 6),
        hub: n.hub,
      }));

      ctx.save();
      ctx.fillStyle = `rgba(17,91,186,${0.13 * reveal})`;
      ctx.fill(mapPath);
      ctx.strokeStyle = `rgba(75,188,255,${0.16 * reveal})`;
      ctx.lineWidth = isCompact ? 6 : 8;
      ctx.stroke(mapPath);
      ctx.strokeStyle = `rgba(112,211,255,${0.76 * reveal})`;
      ctx.lineWidth = isCompact ? 1.25 : 1.5;
      ctx.lineJoin = "round";
      ctx.stroke(mapPath);
      ctx.clip(mapPath);

      const pulseEdges: Array<{ a: (typeof points)[number]; b: (typeof points)[number]; phase: number }> = [];
      for (let i = 0; i < points.length; i++) {
        const a = points[i];
        for (let j = i + 1; j < points.length; j++) {
          const b = points[j];
          const distance = Math.hypot(a.x - b.x, a.y - b.y);
          if (distance > range) continue;
          const closeness = 1 - distance / range;
          ctx.strokeStyle = `rgba(104,185,255,${closeness * (isCompact ? 0.44 : 0.35) * reveal})`;
          ctx.lineWidth = closeness > 0.55 ? 1 : 0.75;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          if ((i * 17 + j * 7) % 29 === 0 && pulseEdges.length < (isCompact ? 5 : 7)) {
            pulseEdges.push({ a, b, phase: (i + j) * 0.11 });
          }
        }

        if (a.hub) {
          const pulse = reduceMotion ? 0.55 : 0.42 + Math.sin(elapsed * 1.15 + i) * 0.13;
          const halo = ctx.createRadialGradient(a.x, a.y, 0, a.x, a.y, isCompact ? 15 : 18);
          halo.addColorStop(0, `rgba(93,190,255,${pulse * reveal})`);
          halo.addColorStop(0.22, `rgba(55,146,255,${pulse * 0.48 * reveal})`);
          halo.addColorStop(1, "rgba(55,146,255,0)");
          ctx.fillStyle = halo;
          ctx.beginPath(); ctx.arc(a.x, a.y, isCompact ? 15 : 18, 0, Math.PI * 2); ctx.fill();
        }

        ctx.fillStyle = `rgba(146,213,255,${(a.hub ? 0.96 : 0.74) * reveal})`;
        ctx.beginPath(); ctx.arc(a.x, a.y, a.hub ? 2.7 : 1.75, 0, Math.PI * 2); ctx.fill();
      }

      if (!reduceMotion) {
        for (const edge of pulseEdges) {
          const progress = (elapsed * 0.22 + edge.phase) % 1;
          const x = edge.a.x + (edge.b.x - edge.a.x) * progress;
          const y = edge.a.y + (edge.b.y - edge.a.y) * progress;
          const glow = ctx.createRadialGradient(x, y, 0, x, y, isCompact ? 8 : 10);
          glow.addColorStop(0, `rgba(209,239,255,${0.95 * reveal})`);
          glow.addColorStop(0.25, `rgba(61,174,255,${0.72 * reveal})`);
          glow.addColorStop(1, "rgba(61,174,255,0)");
          ctx.fillStyle = glow;
          ctx.beginPath(); ctx.arc(x, y, isCompact ? 8 : 10, 0, Math.PI * 2); ctx.fill();
        }
      }
      ctx.restore();

      // The client tiles are the destinations of the territorial network, not a separate block.
      terminals.forEach((terminal, index) => {
        let source = points[0];
        let closest = Number.POSITIVE_INFINITY;
        points.forEach((point) => {
          const distance = Math.hypot(point.x - terminal.x, point.y - terminal.y);
          if (distance < closest) { closest = distance; source = point; }
        });
        const bendX = source.x + (terminal.x - source.x) * 0.56;
        const bendY = Math.min(source.y, terminal.y) - (isCompact ? 12 : 18) + (index % 2) * 9;
        ctx.strokeStyle = `rgba(111,198,255,${(isCompact ? 0.32 : 0.27) * reveal})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.quadraticCurveTo(bendX, bendY, terminal.x, terminal.y);
        ctx.stroke();

        if (!reduceMotion && index % 2 === 0) {
          const progress = (elapsed * 0.19 + terminal.phase) % 1;
          const inv = 1 - progress;
          const x = inv * inv * source.x + 2 * inv * progress * bendX + progress * progress * terminal.x;
          const y = inv * inv * source.y + 2 * inv * progress * bendY + progress * progress * terminal.y;
          const glow = ctx.createRadialGradient(x, y, 0, x, y, isCompact ? 6 : 8);
          glow.addColorStop(0, `rgba(221,245,255,${0.9 * reveal})`);
          glow.addColorStop(0.3, `rgba(62,177,255,${0.62 * reveal})`);
          glow.addColorStop(1, "rgba(62,177,255,0)");
          ctx.fillStyle = glow;
          ctx.beginPath(); ctx.arc(x, y, isCompact ? 6 : 8, 0, Math.PI * 2); ctx.fill();
        }
      });
    }
    function tick(now: number) {
      frame = 0;
      if (!visible || document.hidden || !motion.matches) return;
      if (now - last >= (compact.matches ? 50 : 33)) {
        elapsed += Math.min((now - last) / 1000, 0.05);
        last = now;
        draw(now);
      }
      frame = requestAnimationFrame(tick);
    }
    function sync() {
      cancelAnimationFrame(frame); frame = 0; last = performance.now();
      if (!motion.matches) { elapsed = 0; draw(); }
      if (visible && !document.hidden && motion.matches) frame = requestAnimationFrame(tick);
    }
    function resize() {
      if (!canvas || !ctx) return;
      width = canvas.clientWidth; height = canvas.clientHeight;
      const canvasRect = canvas.getBoundingClientRect();
      terminals = Array.from(document.querySelectorAll<HTMLElement>("[data-partner-tile]")).map((tile, index) => {
        const tileRect = tile.getBoundingClientRect();
        return compact.matches
          ? { x: tileRect.left - canvasRect.left + tileRect.width / 2, y: tileRect.top - canvasRect.top + 2, phase: index * 0.17 }
          : { x: tileRect.left - canvasRect.left + 2, y: tileRect.top - canvasRect.top + tileRect.height / 2, phase: index * 0.17 };
      });
      const dpr = Math.min(devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); draw();
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !revealStartedAt) revealStartedAt = performance.now();
      sync();
    }, { rootMargin: "120px 0px" });
    observer.observe(canvas);
    const sizeObserver = new ResizeObserver(resize); sizeObserver.observe(canvas);
    motion.addEventListener("change", sync);
    compact.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    resize();
    return () => {
      cancelAnimationFrame(frame); observer.disconnect(); sizeObserver.disconnect();
      motion.removeEventListener("change", sync); document.removeEventListener("visibilitychange", sync);
      compact.removeEventListener("change", sync);
    };
  }, []);
  return <canvas ref={ref} className="home-presence-field" aria-hidden="true" />;
}

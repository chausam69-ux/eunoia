"use client";

import { useEffect, useRef } from "react";

// Sonar dot-grid (after 21st.dev "Sonar Grid" by NIMA MZ — re-implemented from its spec).
// Dots brighten as rings pass over them. Rings spawn on click/tap and as ambient pings.
// Colour = --accent of the active theme. Reduced motion = static grid, no rings.
type Ring = { x: number; y: number; t0: number };

export function SonarGrid({
  spacing = 26,
  speed = 260, // px per second
  pingEvery = 2.4, // seconds
  amplitude = 2.2,
  ringWidth = 90,
}: {
  spacing?: number;
  speed?: number;
  pingEvery?: number;
  amplitude?: number;
  ringWidth?: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const parent = canvas.parentElement!;
    let w = 0, h = 0, dpr = 1;
    let rings: Ring[] = [];
    let raf = 0;
    let visible = true;
    let lastPing = performance.now() - pingEvery * 1000 * 0.6; // first ping mid-flight at paint

    const color = () => {
      const c = getComputedStyle(parent).getPropertyValue("--accent").trim() || "#ff4d00";
      const base = getComputedStyle(parent).getPropertyValue("--paper").trim() || "#f4f2ee";
      return { c, base };
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = parent.clientWidth;
      h = parent.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reduce) draw(performance.now());
    };

    const hexToRgb = (hex: string) => {
      const m = hex.replace("#", "");
      const n = parseInt(m.length === 3 ? m.split("").map((x) => x + x).join("") : m, 16);
      return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    };

    const draw = (now: number) => {
      const { c, base } = color();
      const [cr, cg, cb] = hexToRgb(c);
      const [br, bg, bb] = hexToRgb(base);
      ctx.clearRect(0, 0, w, h);
      const maxR = Math.hypot(w, h);
      rings = rings.filter((r) => (now - r.t0) / 1000 * speed < maxR + ringWidth);
      const cols = Math.ceil(w / spacing) + 1;
      const rows = Math.ceil(h / spacing) + 1;
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * spacing + (spacing / 2);
          const y = j * spacing + (spacing / 2);
          let e = 0;
          for (const r of rings) {
            const rad = ((now - r.t0) / 1000) * speed;
            const d = Math.abs(Math.hypot(x - r.x, y - r.y) - rad);
            if (d < ringWidth) {
              const k = 1 - d / ringWidth;
              e += k * k * Math.max(0, 1 - rad / maxR);
            }
          }
          e = Math.min(1, e);
          const a = 0.16 + e * 0.84;
          const rr = 1 + e * amplitude;
          const cc = e > 0.02 ? `rgba(${cr},${cg},${cb},${a})` : `rgba(${br},${bg},${bb},${a * 0.9})`;
          ctx.fillStyle = cc;
          ctx.beginPath();
          ctx.arc(x, y, rr, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible) return;
      if (now - lastPing > pingEvery * 1000) {
        lastPing = now;
        rings.push({ x: Math.random() * w, y: Math.random() * h, t0: now });
      }
      draw(now);
    };

    const onPointer = (e: PointerEvent) => {
      const b = parent.getBoundingClientRect();
      rings.push({ x: e.clientX - b.left, y: e.clientY - b.top, t0: performance.now() });
    };

    const io = new IntersectionObserver(([en]) => (visible = en.isIntersecting));
    io.observe(parent);
    const ro = new ResizeObserver(resize);
    ro.observe(parent);
    resize();

    if (!reduce) {
      parent.addEventListener("pointerdown", onPointer, { passive: true });
      raf = requestAnimationFrame(loop);
    }
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      parent.removeEventListener("pointerdown", onPointer);
    };
  }, [spacing, speed, pingEvery, amplitude, ringWidth]);

  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1] opacity-60" />;
}

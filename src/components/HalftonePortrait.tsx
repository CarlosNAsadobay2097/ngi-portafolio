"use client";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

/**
 * Retrato en semitono (puntos de imprenta) generado en <canvas>.
 * Una "lupa" circular sigue al cursor y revela la fotografía real.
 */
export default function HalftonePortrait({ src, alt, hint }: { src: string; alt: string; hint: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const photo = useRef<HTMLImageElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrap.current!;
    const cv = canvas.current!;
    const ctx2d = cv.getContext("2d")!;
    const img = new Image();
    img.src = src;
    const state = { progress: prefersReducedMotion() ? 1 : 0, x: 0.5, y: 0.35, r: 0 };
    let samples: { x: number; y: number; d: number }[] = [];
    let step = 9;

    const sample = () => {
      if (!img.complete || !img.naturalWidth) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const W = el.clientWidth;
      const H = el.clientHeight;
      cv.width = W * dpr;
      cv.height = H * dpr;
      ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);
      step = W < 420 ? 7 : 9;
      const cols = Math.ceil(W / step);
      const rows = Math.ceil(H / step);
      const off = document.createElement("canvas");
      off.width = cols;
      off.height = rows;
      const o = off.getContext("2d", { willReadFrequently: true })!;
      // object-fit: cover, alineado abajo
      const s = Math.max(cols / img.naturalWidth, rows / img.naturalHeight);
      const dw = img.naturalWidth * s;
      const dh = img.naturalHeight * s;
      o.drawImage(img, (cols - dw) / 2, rows - dh, dw, dh);
      const data = o.getImageData(0, 0, cols, rows).data;
      samples = [];
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const k = (j * cols + i) * 4;
          const a = data[k + 3] / 255;
          if (a < 0.05) continue;
          const lum = (0.299 * data[k] + 0.587 * data[k + 1] + 0.114 * data[k + 2]) / 255;
          const d = Math.pow(1 - lum, 0.9) * a;
          if (d < 0.04) continue;
          // patrón desplazado (como en imprenta)
          samples.push({ x: i * step + step / 2 + (j % 2 ? step / 2 : 0), y: j * step + step / 2, d });
        }
      }
      draw();
    };

    const draw = () => {
      const W = el.clientWidth;
      const H = el.clientHeight;
      ctx2d.clearRect(0, 0, W, H);
      ctx2d.fillStyle = "#2a0005";
      const max = step * 0.62;
      const p = state.progress;
      ctx2d.beginPath();
      for (const s of samples) {
        const local = Math.min(1, Math.max(0, p * 1.5 - (s.y / H) * 0.5));
        if (local <= 0) continue;
        const r = max * Math.sqrt(s.d) * local;
        if (r < 0.35) continue;
        ctx2d.moveTo(s.x + r, s.y);
        ctx2d.arc(s.x, s.y, r, 0, Math.PI * 2);
      }
      ctx2d.fill();
    };

    const setLens = () => {
      el.style.setProperty("--x", `${state.x * 100}%`);
      el.style.setProperty("--y", `${state.y * 100}%`);
      el.style.setProperty("--r", `${state.r}px`);
      if (ring.current) {
        ring.current.style.transform = `translate(-50%,-50%) translate(${state.x * el.clientWidth}px, ${state.y * el.clientHeight}px)`;
        ring.current.style.width = ring.current.style.height = `${state.r * 2}px`;
      }
    };

    img.onload = sample;
    if (img.complete) sample();
    const ro = new ResizeObserver(sample);
    ro.observe(el);

    const lensR = () => Math.min(el.clientWidth * 0.26, 150);
    const touch = window.matchMedia("(hover: none)").matches;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      gsap.to(state, { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height, duration: 0.5, ease: "power3.out", onUpdate: setLens });
    };
    const onEnter = () => gsap.to(state, { r: lensR(), duration: 0.6, ease: "back.out(1.8)", onUpdate: setLens });
    const onLeave = () => gsap.to(state, { r: 0, duration: 0.45, ease: "power3.in", onUpdate: setLens });

    let wander: gsap.core.Timeline | null = null;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: "top 80%",
        once: true,
        onEnter: () => {
          gsap.to(state, { progress: 1, duration: prefersReducedMotion() ? 0 : 2.2, ease: "power2.out", onUpdate: draw });
          if (touch && !prefersReducedMotion()) {
            // En móvil la lupa recorre el rostro sola
            state.x = 0.5;
            state.y = 0.3;
            wander = gsap.timeline({ repeat: -1, yoyo: true, delay: 1.2, onUpdate: setLens });
            wander
              .to(state, { r: lensR() * 0.9, duration: 0.8, ease: "back.out(1.6)" })
              .to(state, { x: 0.38, y: 0.42, duration: 2.2, ease: "sine.inOut" })
              .to(state, { x: 0.62, y: 0.28, duration: 2.4, ease: "sine.inOut" })
              .to(state, { x: 0.5, y: 0.62, duration: 2.2, ease: "sine.inOut" });
          }
        },
      });
    });

    if (!touch) {
      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerenter", onEnter);
      el.addEventListener("pointerleave", onLeave);
    }
    setLens();

    return () => {
      ro.disconnect();
      ctx.revert();
      (wander as gsap.core.Timeline | null)?.kill();
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [src]);

  const mask = "radial-gradient(circle var(--r) at var(--x) var(--y), #000 98%, transparent 100%)";

  return (
    <figure className="relative">
      <div ref={wrap} className="relative aspect-[1000/1166] w-full select-none" data-cursor="lens">
        <canvas ref={canvas} className="absolute inset-0 size-full" aria-hidden />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={photo}
          src={src}
          alt={alt}
          className="absolute inset-0 size-full object-cover object-bottom"
          style={{ WebkitMaskImage: mask, maskImage: mask }}
          draggable={false}
        />
        <div ref={ring} className="absolute left-0 top-0 rounded-full border-2 border-white pointer-events-none shadow-[0_0_0_6px_rgba(255,255,255,0.12)]" aria-hidden />
      </div>
      <figcaption className="eyebrow text-white/70 mt-4 hidden [@media(hover:hover)]:block">◎ {hint}</figcaption>
    </figure>
  );
}

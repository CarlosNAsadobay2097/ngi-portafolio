"use client";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/** Cursor: punto rojo + anillo que reacciona a enlaces, lupa y pliegues. */
export default function Cursor() {
  const root = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    document.documentElement.classList.add("has-cursor");
    const xd = gsap.quickTo(dot.current, "x", { duration: 0.12, ease: "power3" });
    const yd = gsap.quickTo(dot.current, "y", { duration: 0.12, ease: "power3" });
    const xr = gsap.quickTo(ring.current, "x", { duration: 0.45, ease: "power3" });
    const yr = gsap.quickTo(ring.current, "y", { duration: 0.45, ease: "power3" });
    gsap.set([dot.current, ring.current], { opacity: 0 });

    let point: { x: number; y: number } | null = null;
    let frame = 0;
    const updateTone = () => {
      frame = 0;
      if (!point) return;
      let tone = "red";
      // Revisar las capas bajo el puntero permite detectar también el círculo
      // rojo detrás de la capa transparente del contenido de la portada.
      for (const el of document.elementsFromPoint(point.x, point.y)) {
        const explicit = el.getAttribute("data-cursor-tone");
        if (explicit) {
          tone = explicit;
          break;
        }
        const color = getComputedStyle(el).backgroundColor.match(/[\d.]+/g)?.map(Number);
        if (!color || (color[3] ?? 1) < 0.5) continue;
        const [r, g, b] = color;
        if (r > 80 && r > g * 1.6 && r > b * 1.6) tone = "ink";
        break;
      }
      root.current!.dataset.tone = tone;
    };
    const scheduleTone = () => {
      if (!frame) frame = requestAnimationFrame(updateTone);
    };
    const move = (e: PointerEvent) => {
      point = { x: e.clientX, y: e.clientY };
      scheduleTone();
      gsap.to([dot.current, ring.current], { opacity: 1, duration: 0.3, overwrite: "auto" });
      xd(e.clientX);
      yd(e.clientY);
      xr(e.clientX);
      yr(e.clientY);
      const target = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor], a, button, input, textarea");
      const kind = target?.dataset.cursor ?? (target ? (target.matches("input,textarea") ? "text" : "hover") : "");
      const r = ring.current!;
      r.dataset.kind = kind;
      label.current!.textContent = kind === "peel" ? "↘" : "";
    };
    const leave = () => gsap.to([dot.current, ring.current], { opacity: 0, duration: 0.3 });
    window.addEventListener("pointermove", move);
    window.addEventListener("scroll", scheduleTone, { passive: true });
    document.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("scroll", scheduleTone);
      cancelAnimationFrame(frame);
      document.removeEventListener("pointerleave", leave);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  return (
    <div ref={root} aria-hidden className="custom-cursor pointer-events-none fixed inset-0 z-[160] hidden [@media(hover:hover)_and_(pointer:fine)]:block">
      <div ref={dot} className="cursor-dot fixed left-0 top-0 -ml-1 -mt-1 size-2 rounded-full mix-blend-normal" />
      <div
        ref={ring}
        data-kind=""
        className="cursor-ring fixed left-0 top-0 -ml-5 -mt-5 size-10 rounded-full border grid place-items-center transition-[width,height,margin,background-color,border-color,opacity] duration-300 ease-out"
      >
        <span ref={label} className="text-white text-sm font-bold" />
      </div>
    </div>
  );
}

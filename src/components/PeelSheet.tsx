"use client";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { applyPeel } from "@/lib/peel";
import PeelFlap from "./PeelFlap";

/**
 * Transición entre secciones: una hoja del color de la sección anterior
 * cubre la nueva y se despega desde la esquina superior mientras haces scroll.
 */
export default function PeelSheet({ color, side = "right" }: { color: string; side?: "left" | "right" }) {
  const wrap = useRef<HTMLDivElement>(null);
  const sheet = useRef<HTMLDivElement>(null);
  const flap = useRef<SVGPolygonElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) {
      if (wrap.current) wrap.current.style.display = "none";
      return;
    }
    const section = wrap.current!.parentElement!;
    const st = ScrollTrigger.create({
      trigger: section,
      start: "top bottom",
      end: "top 5%",
      scrub: true,
      onUpdate: (self) => {
        const s = sheet.current!;
        const p = gsap.utils.interpolate(0, s.offsetWidth + s.offsetHeight + 60, gsap.parseEase("power1.inOut")(self.progress));
        applyPeel(s, flap.current, p);
        wrap.current!.style.visibility = self.progress >= 0.999 ? "hidden" : "visible";
      },
    });
    return () => st.kill();
  }, []);

  return (
    <div
      ref={wrap}
      aria-hidden
      className="absolute inset-x-0 top-0 h-[100svh] z-20 pointer-events-none"
      style={{ transform: side === "right" ? "scaleY(-1)" : "scale(-1,-1)" }}
    >
      <div ref={sheet} className="absolute inset-0" style={{ background: color }} />
      <PeelFlap ref={flap} tone={color.includes("red") ? "red" : "light"} />
    </div>
  );
}

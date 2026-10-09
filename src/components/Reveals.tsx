"use client";
import { useEffect } from "react";
import { gsap, ScrollTrigger, SplitText, prefersReducedMotion } from "@/lib/gsap";

/** Animaciones de entrada genéricas: [data-reveal] y títulos [data-split]. */
export default function Reveals() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      document.querySelectorAll<HTMLElement>("[data-split]").forEach((el) => {
        SplitText.create(el, {
          type: "lines",
          mask: "lines",
          linesClass: "split-line",
          autoSplit: true, // espera a las fuentes y re-divide al cambiar el ancho
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 105,
              duration: 1.1,
              stagger: 0.1,
              ease: "expo.out",
              scrollTrigger: { trigger: el, start: "top 85%", once: true },
            }),
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        const kind = el.dataset.reveal;
        gsap.fromTo(
          el,
          { opacity: 0, y: kind === "card" ? 90 : 36, scale: kind === "card" ? 0.97 : 1 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: kind === "card" ? 1.3 : 1,
            ease: "expo.out",
            delay: Number(el.dataset.delay ?? 0),
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          },
        );
      });

      // Recalcular tras cargar imágenes/fuentes
      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener("load", refresh);
      document.fonts?.ready.then(refresh);
    });
    return () => ctx.revert();
  }, []);
  return null;
}

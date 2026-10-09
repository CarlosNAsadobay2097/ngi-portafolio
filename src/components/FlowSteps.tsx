"use client";
import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

/** Flujo de pasos con una línea que se dibuja con el scroll. */
export default function FlowSteps({ steps }: { steps: { t: string; d: string }[] }) {
  const root = useRef<HTMLOListElement>(null);
  useEffect(() => {
    if (prefersReducedMotion()) {
      root.current?.querySelectorAll(".step-dot").forEach((d) => d.classList.add("is-on"));
      return;
    }
    const ctx = gsap.context(() => {
      const dots = gsap.utils.toArray<HTMLElement>(".step-dot");
      gsap.fromTo(
        ".flow-line",
        { scaleX: 0, scaleY: 0 },
        {
          scaleX: 1,
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top 75%",
            end: "bottom 55%",
            scrub: 0.5,
            onUpdate: (self) => {
              dots.forEach((d, i) => d.classList.toggle("is-on", self.progress >= i / Math.max(1, dots.length - 1) - 0.02));
            },
          },
        },
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <ol ref={root} className="relative grid gap-10 md:grid-cols-4 md:gap-6">
      {/* línea */}
      <span aria-hidden className="absolute bg-white/10 md:left-5 md:right-5 md:top-5 md:h-px left-5 top-5 bottom-5 w-px md:w-auto md:bottom-auto" />
      <span
        aria-hidden
        className="flow-line absolute bg-red md:left-5 md:right-5 md:top-5 md:h-px left-5 top-5 bottom-5 w-px md:w-auto md:bottom-auto origin-top md:origin-left"
      />
      {steps.map((s, i) => (
        <li key={s.t} className="relative pl-16 md:pl-0">
          <span className="step-dot absolute left-0 top-0 md:static size-10 rounded-full border border-white/20 bg-ink grid place-items-center font-mono text-sm transition-all duration-500 [&.is-on]:bg-red [&.is-on]:border-red [&.is-on]:scale-110">
            0{i + 1}
          </span>
          <h4 className="md:mt-6 font-display font-semibold text-xl mb-2">{s.t}</h4>
          <p className="text-bone/65 leading-relaxed text-[0.97rem]">{s.d}</p>
        </li>
      ))}
    </ol>
  );
}

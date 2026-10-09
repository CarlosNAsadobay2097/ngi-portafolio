"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

/** Teléfonos con capturas que se desplazan a distinta velocidad (parallax). */
export default function PhoneParallax({ images }: { images: { src: string; alt: string }[] }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const k = window.innerWidth < 1024 ? 0.35 : 1;
      gsap.utils.toArray<HTMLElement>(".phone-col").forEach((col, i) => {
        gsap.fromTo(
          col,
          { y: [80, -40, 140][i % 3] * k },
          { y: [-80, 60, -120][i % 3] * k, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } },
        );
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const cols = [images.slice(0, 2), images.slice(2, 4), images.slice(4, 6)];
  return (
    <div ref={root} className="grid grid-cols-3 gap-3 sm:gap-5 py-10">
      {cols.map((col, i) => (
        <div key={i} className="phone-col space-y-3 sm:space-y-5">
          {col.map((im) => (
            <div key={im.src} className="rounded-[22px] sm:rounded-[30px] p-1.5 sm:p-2 bg-ink-3 border border-white/10 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.9)]">
              <div className="relative aspect-[828/1792] rounded-[16px] sm:rounded-[22px] overflow-hidden bg-black">
                <Image src={im.src} alt={im.alt} fill sizes="(min-width:1024px) 220px, 33vw" className="object-cover" />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

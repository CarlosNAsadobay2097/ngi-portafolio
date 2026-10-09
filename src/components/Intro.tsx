"use client";
import { useEffect, useRef, useState } from "react";
import Logo from "./Logo";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

declare global {
  interface Window {
    __introDone?: boolean;
  }
}

export function onIntroDone(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  if (window.__introDone) {
    cb();
    return () => {};
  }
  const h = () => cb();
  window.addEventListener("ngi:intro-done", h, { once: true });
  return () => window.removeEventListener("ngi:intro-done", h);
}

function finish() {
  window.__introDone = true;
  window.dispatchEvent(new Event("ngi:intro-done"));
  window.__lenis?.start();
}

/**
 * Intro: el logo NGi se arma pieza por pieza, la esquina se despliega,
 * el círculo rojo crece hasta cubrir la pantalla y se recoge en el logo del menú.
 */
export default function Intro({ skipLabel, tagline }: { skipLabel: string; tagline: string }) {
  const root = useRef<HTMLDivElement>(null);
  const logoWrap = useRef<HTMLDivElement>(null);
  const red = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("ngi-intro") === "1";
    } catch {}
    if (seen || prefersReducedMotion()) {
      setGone(true);
      finish();
      return;
    }
    try {
      sessionStorage.setItem("ngi-intro", "1");
    } catch {}

    window.__lenis?.stop();
    const q = (s: string) => logoWrap.current!.querySelector(`[data-part="${s}"]`);
    const parts = {
      circle: q("circle"),
      main: q("main"),
      nfold: q("nfold"),
      gfold: q("gfold"),
      istem: q("istem"),
      idot: q("idot"),
    };

    const ctx = gsap.context(() => {
      gsap.set(parts.circle, { scale: 0, rotation: -120, transformOrigin: "50% 50%" });
      gsap.set(parts.main, { opacity: 0, y: 60, transformOrigin: "50% 50%" });
      gsap.set(parts.nfold, { scaleY: 0, transformOrigin: "50% 100%" });
      gsap.set(parts.gfold, { scaleY: 0, transformOrigin: "50% 0%" });
      gsap.set(parts.istem, { scaleY: 0, transformOrigin: "50% 100%" });
      gsap.set(parts.idot, { scale: 0, y: -140, transformOrigin: "50% 50%" });
      gsap.set(".intro-tag span span", { yPercent: 110 });

      const t = gsap.timeline({ delay: 0.25, onComplete: () => { setGone(true); finish(); } });
      tl.current = t;
      t.to(parts.circle, { scale: 1, rotation: 0, duration: 1.1, ease: "back.out(1.5)" })
        .to(parts.main, { opacity: 1, y: 0, duration: 0.7, ease: "power4.out" }, "-=0.45")
        .to(parts.istem, { scaleY: 1, duration: 0.5, ease: "power3.out" }, "-=0.45")
        .to(parts.idot, { scale: 1, y: 0, duration: 0.8, ease: "bounce.out" }, "-=0.25")
        .to(parts.nfold, { scaleY: 1, duration: 0.55, ease: "back.out(2.2)" }, "-=0.7")
        .to(parts.gfold, { scaleY: 1, duration: 0.55, ease: "back.out(2.2)" }, "-=0.45")
        .to(".intro-tag span span", { yPercent: 0, duration: 0.7, stagger: 0.06, ease: "power3.out" }, "-=0.4")
        .addLabel("hold", "+=0.45")
        // El círculo crece hasta cubrir la pantalla
        .to(".intro-tag span span", { yPercent: -110, duration: 0.4, stagger: 0.03, ease: "power2.in" }, "hold")
        .to([parts.main, parts.nfold, parts.gfold, parts.istem, parts.idot], { opacity: 0, duration: 0.25 }, "hold")
        .to(logoWrap.current, {
          scale: () => {
            const d = Math.hypot(window.innerWidth, window.innerHeight);
            return (d / logoWrap.current!.offsetWidth) * 1.15;
          },
          duration: 0.8,
          ease: "power3.in",
        }, "hold+=0.1")
        .set(red.current, { autoAlpha: 1 })
        .set(logoWrap.current, { autoAlpha: 0 })
        .set(root.current, { backgroundColor: "transparent" })
        // ...y se recoge en el logo del menú
        .to(red.current, {
          clipPath: () => {
            const nav = document.getElementById("nav-logo")?.getBoundingClientRect();
            const x = nav ? nav.left + nav.width / 2 : 40;
            const y = nav ? nav.top + nav.height / 2 : 40;
            return `circle(0px at ${x}px ${y}px)`;
          },
          duration: 1.05,
          ease: "power4.inOut",
          onStart: () => {
            const nav = document.getElementById("nav-logo")?.getBoundingClientRect();
            const x = nav ? nav.left + nav.width / 2 : 40;
            const y = nav ? nav.top + nav.height / 2 : 40;
            gsap.set(red.current, { clipPath: `circle(150vmax at ${x}px ${y}px)` });
            window.dispatchEvent(new Event("ngi:intro-reveal"));
          },
        });
    }, root);

    return () => {
      ctx.revert();
    };
  }, []);

  if (gone) return null;

  return (
    <div ref={root} className="fixed inset-0 z-[100] bg-ink grid place-items-center" aria-hidden>
      <div className="flex flex-col items-center gap-8">
        <div ref={logoWrap} className="w-[min(44vmin,340px)] aspect-square will-change-transform">
          <Logo />
        </div>
        <p className="intro-tag eyebrow text-bone/70 flex flex-wrap justify-center gap-x-[0.6em] gap-y-1 max-w-[86vw] text-center">
          {tagline.split(" ").map((w, i) => (
            <span key={i} className="inline-block overflow-hidden">
              <span className="inline-block">{w}</span>
            </span>
          ))}
        </p>
      </div>
      <div ref={red} className="absolute inset-0 bg-red invisible" />
      <button
        onClick={() => tl.current?.progress(1)}
        className="absolute bottom-6 right-6 eyebrow text-bone/60 hover:text-bone link-u"
        tabIndex={-1}
      >
        {skipLabel} →
      </button>
    </div>
  );
}

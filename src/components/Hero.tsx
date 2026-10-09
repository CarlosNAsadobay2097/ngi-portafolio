"use client";
import { useEffect, useRef } from "react";
import { gsap, SplitText, prefersReducedMotion } from "@/lib/gsap";
import { onIntroDone } from "./Intro";
import type { Content } from "@/content/content";

export default function Hero({ t, cvHref }: { t: Content["hero"]; cvHref: string }) {
  const root = useRef<HTMLElement>(null);
  const circle = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current!;
    const reduced = prefersReducedMotion();
    const fades = el.querySelectorAll<HTMLElement>(".hero-fade");
    const parallax = el.querySelector<HTMLElement>(".hero-parallax");
    let lines: Element[] = [];
    let played = false;

    const ctx = gsap.context(() => {
      // autoSplit: vuelve a dividir cuando cargan las fuentes o cambia el ancho
      SplitText.create(el.querySelectorAll(".hero-title .line"), {
        type: "lines",
        mask: "lines",
        linesClass: "split-line",
        autoSplit: true,
        onSplit(self) {
          lines = self.lines;
          if (!played && !reduced) gsap.set(lines, { yPercent: 105 });
        },
      });
      if (!reduced) {
        gsap.set(fades, { opacity: 0, y: 24 });
        gsap.set(circle.current, { scale: 0.6, opacity: 0 });
      }
    }, el);

    const play = () => {
      if (reduced || played) return;
      played = true;
      ctx.add(() => {
        gsap
          .timeline()
          .to(circle.current, { scale: 1, opacity: 1, duration: 1.4, ease: "expo.out" })
          .to(lines, { yPercent: 0, duration: 1.1, stagger: 0.12, ease: "expo.out" }, 0.1)
          .to(fades, { opacity: 1, y: 0, duration: 0.9, stagger: 0.08, ease: "power3.out" }, 0.45);
      });
    };
    window.addEventListener("ngi:intro-reveal", play, { once: true });
    const off = onIntroDone(play);

    let move: ((e: PointerEvent) => void) | null = null;
    if (!reduced) {
      ctx.add(() => {
        // Al hacer scroll, el círculo crece y cubre la pantalla → entra la sección roja
        const coverScale = () => {
          const r = circle.current!.getBoundingClientRect();
          const sc = (gsap.getProperty(circle.current, "scale") as number) || 1;
          const cx = r.left + r.width / 2;
          const cy = r.top + r.height / 2;
          const far = Math.max(
            Math.hypot(cx, cy),
            Math.hypot(window.innerWidth - cx, cy),
            Math.hypot(cx, window.innerHeight - cy),
            Math.hypot(window.innerWidth - cx, window.innerHeight - cy),
          );
          return (far / (r.width / sc / 2)) * 1.05;
        };
        gsap
          .timeline({
            scrollTrigger: { trigger: el, start: "top top", end: "+=110%", scrub: 0.6, pin: true, anticipatePin: 1, invalidateOnRefresh: true },
          })
          .to(el.querySelector(".hero-content"), { yPercent: -18, opacity: 0, ease: "none", duration: 0.6 }, 0)
          .to(el.querySelectorAll(".hero-ring"), { opacity: 0, ease: "none", duration: 0.3 }, 0)
          .fromTo(circle.current, { scale: 1 }, { scale: coverScale, ease: "power2.in", duration: 1, immediateRender: false }, 0);
      });

      // Parallax con el mouse
      const qx = gsap.quickTo(parallax, "x", { duration: 1.2, ease: "power3.out" });
      const qy = gsap.quickTo(parallax, "y", { duration: 1.2, ease: "power3.out" });
      move = (e: PointerEvent) => {
        qx((e.clientX / window.innerWidth - 0.5) * 24);
        qy((e.clientY / window.innerHeight - 0.5) * 24);
      };
      window.addEventListener("pointermove", move);
    }

    return () => {
      window.removeEventListener("ngi:intro-reveal", play);
      if (move) window.removeEventListener("pointermove", move);
      off();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={root} id="top" className="relative h-[100svh] min-h-[640px] overflow-hidden bg-ink">
      {/* Círculo NGi */}
      <div className="hero-parallax absolute right-[-45vw] bottom-[-22vh] sm:right-[-30vw] sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 lg:right-[-16vw]">
        <div
          ref={circle}
          className="relative size-[110vw] sm:size-[78vmin] lg:size-[80vmin] rounded-full will-change-transform"
          style={{ background: "radial-gradient(circle at 35% 30%, #ef1a30 0%, #df061e 45%, #9a0012 100%)" }}
        >
          <svg className="hero-ring absolute inset-[6%] spin-slow text-white/80" viewBox="0 0 200 200" aria-hidden>
            <defs>
              <path id="ring-path" d="M100,100 m-88,0 a88,88 0 1,1 176,0 a88,88 0 1,1 -176,0" />
            </defs>
            <text fontSize="7.4" letterSpacing="2.4" fill="currentColor" fontFamily="var(--font-mono)">
              <textPath href="#ring-path">{t.ring + t.ring}</textPath>
            </text>
          </svg>
          {/* esquina doblada, como en el logo */}
          <span
            aria-hidden
            className="hero-ring absolute left-[18%] top-[64%] size-[14%] rotate-[8deg]"
            style={{ background: "linear-gradient(135deg,#fff 0%,#e9e4dd 55%,#7a746e 100%)", clipPath: "polygon(0 0,100% 0,0 100%)", filter: "drop-shadow(6px 6px 10px rgba(0,0,0,.35))" }}
          />
        </div>
      </div>

      <div className="hero-content relative z-10 container-x h-full flex flex-col justify-center pt-24 pb-16">
        <p className="hero-fade eyebrow text-red mb-6 flex items-center gap-3">
          <span className="inline-block size-2 rounded-full bg-red" /> {t.kicker}
        </p>
        <h1 className="hero-title display text-[clamp(2.4rem,6.6vw,6.4rem)] max-w-[13ch] lg:max-w-[16ch]">
          <span className="line block">{t.lineA}</span>
          <span className="line block text-bone/50">{t.lineB}</span>
        </h1>
        <p className="hero-fade mt-8 max-w-[52ch] text-[clamp(1rem,1.4vw,1.2rem)] leading-relaxed text-bone/75">{t.sub}</p>
        <div className="hero-fade mt-10 flex flex-wrap items-center gap-3">
          <a href="#proyectos" className="btn btn-red" data-cursor="hover">
            {t.ctaWork} <span aria-hidden>↓</span>
          </a>
          <a href={cvHref} download className="btn btn-ghost text-bone" data-cursor="hover">
            {t.ctaCv}
          </a>
        </div>
        <div className="hero-fade absolute bottom-8 left-0 right-0 container-x flex items-end justify-between text-bone/55">
          <p className="eyebrow">{t.location}</p>
          <p className="eyebrow hidden sm:flex items-center gap-3">
            {t.scroll}
            <span className="relative block w-px h-10 bg-white/20 overflow-hidden">
              <span className="absolute inset-x-0 top-0 h-1/2 bg-red animate-[scrollcue_1.8s_ease-in-out_infinite]" />
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}


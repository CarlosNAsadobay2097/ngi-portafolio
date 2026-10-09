"use client";
import { useEffect, useRef, useState } from "react";
import Logo from "./Logo";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import type { Content } from "@/content/content";
import type { Locale } from "@/lib/i18n";
import { onIntroDone } from "./Intro";

export default function Nav({ t, locale, cvHref }: { t: Content["nav"]; locale: Locale; cvHref: string }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const curtain = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLElement>(null);
  const other: Locale = locale === "es" ? "en" : "es";

  const items = [
    ["#perfil", t.about],
    ["#proyectos", t.work],
    ["#ia", t.ai],
    ["#ar", t.ar],
    ["#open-source", t.os],
    ["#stack", t.stack],
  ] as const;

  // Cortina de llegada (cambio de idioma)
  useEffect(() => {
    const html = document.documentElement;
    if (html.classList.contains("curtain-in") && curtain.current) {
      gsap.fromTo(
        curtain.current,
        { clipPath: "circle(150vmax at 50% 50%)" },
        {
          clipPath: "circle(0px at 50% 50%)",
          duration: 1,
          ease: "power4.inOut",
          delay: 0.1,
          onComplete: () => html.classList.remove("curtain-in"),
        },
      );
    }
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Entrada del menú tras la intro
  useEffect(() => {
    if (!bar.current) return;
    gsap.set(bar.current, { yPercent: -120 });
    const show = () => gsap.to(bar.current, { yPercent: 0, duration: 0.9, ease: "power3.out", delay: 0.35 });
    window.addEventListener("ngi:intro-reveal", show, { once: true });
    const off = onIntroDone(show);
    return () => {
      window.removeEventListener("ngi:intro-reveal", show);
      off();
    };
  }, []);

  useEffect(() => {
    if (open) window.__lenis?.stop();
    else window.__lenis?.start();
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  const switchLang = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const href = `/${other}${window.location.hash}`;
    if (prefersReducedMotion() || !curtain.current) return;
    e.preventDefault();
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    gsap.fromTo(
      curtain.current,
      { clipPath: `circle(0px at ${x}px ${y}px)` },
      {
        clipPath: `circle(150vmax at ${x}px ${y}px)`,
        duration: 0.8,
        ease: "power4.inOut",
        onComplete: () => {
          try {
            sessionStorage.setItem("ngi-curtain", "1");
          } catch {}
          window.location.assign(href);
        },
      },
    );
  };

  return (
    <>
      <a href="#contenido" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] btn btn-red">
        {t.skip}
      </a>
      <header
        ref={bar}
        className={`fixed top-0 inset-x-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-500 border-b ${
          scrolled && !open ? "bg-ink/70 backdrop-blur-xl border-white/5" : "border-transparent"
        }`}
      >
        <nav className="container-x flex items-center justify-between h-[72px]" aria-label="Principal">
          <a href="#top" id="nav-logo" className="flex items-center gap-3 group" aria-label="NGi — Inicio" data-cursor="hover">
            <span className="block size-10 transition-transform duration-500 group-hover:rotate-[-12deg]">
              <Logo flat />
            </span>
            <span className="hidden sm:block leading-tight">
              <span className="block text-sm font-bold tracking-tight">Carlos Asadobay</span>
              <span className="block eyebrow !text-[0.62rem] text-muted">Full-Stack & Creative Dev</span>
            </span>
          </a>

          <ul className="hidden lg:flex items-center gap-7 text-sm font-semibold">
            {items.map(([href, label]) => (
              <li key={href}>
                <a href={href} className="link-u text-bone/80 hover:text-bone" data-cursor="hover">
                  {label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <a
              href={`/${other}`}
              hrefLang={other}
              onClick={switchLang}
              aria-label={t.switchLabel}
              className="size-11 grid place-items-center rounded-full border border-white/15 font-mono text-xs font-bold hover:bg-bone hover:text-ink transition-colors"
              data-cursor="hover"
            >
              {t.switchTo}
            </a>
            <a href="#contacto" className="hidden sm:inline-flex btn btn-red !py-2.5 !px-5 text-sm" data-cursor="hover">
              {t.contact}
            </a>
            <button
              className="lg:hidden size-11 grid place-items-center rounded-full bg-bone text-ink"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label="Menú"
              onClick={() => setOpen((o) => !o)}
            >
              <span className="relative w-4 h-3">
                <span className={`absolute left-0 w-4 h-0.5 bg-current transition-all duration-300 ${open ? "top-1.5 rotate-45" : "top-0"}`} />
                <span className={`absolute left-0 w-4 h-0.5 bg-current transition-all duration-300 ${open ? "top-1.5 -rotate-45" : "top-2.5"}`} />
              </span>
            </button>
          </div>
        </nav>
      </header>

      {/* Menú móvil */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 z-40 bg-red text-white lg:hidden transition-[clip-path] duration-700 ease-[cubic-bezier(.76,0,.24,1)] ${
          open ? "[clip-path:circle(150%_at_calc(100%-38px)_36px)]" : "[clip-path:circle(0%_at_calc(100%-38px)_36px)] pointer-events-none"
        }`}
        aria-hidden={!open}
        inert={!open}
      >
        <div className="container-x pt-28 pb-10 h-full flex flex-col">
          <ul className="space-y-2">
            {[...items, ["#contacto", t.contact] as const].map(([href, label], i) => (
              <li key={href}>
                <a href={href} onClick={() => setOpen(false)} className="display text-[clamp(2.2rem,10vw,3.6rem)] flex items-baseline gap-4">
                  <span className="font-mono text-xs opacity-60">0{i + 1}</span>
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <a href={cvHref} download className="mt-auto btn bg-white text-red w-fit">
            CV ↓
          </a>
        </div>
      </div>

      <div ref={curtain} className="curtain" aria-hidden />
    </>
  );
}

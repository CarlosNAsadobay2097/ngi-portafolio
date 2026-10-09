"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { applyPeel } from "@/lib/peel";
import PeelFlap from "./PeelFlap";
import type { Content } from "@/content/content";

type Project = Content["projects"][number];
type Labels = Content["work"]["labels"];

export default function ProjectCard({
  project,
  labels,
  peelOpen,
  peelClose,
  index,
}: {
  project: Project;
  labels: Labels;
  peelOpen: string;
  peelClose: string;
  index: number;
}) {
  const faceA = useRef<HTMLDivElement>(null);
  const flap = useRef<SVGPolygonElement>(null);
  const state = useRef({ p: 0 });
  const [open, setOpen] = useState(false);
  // layoutB = la cara técnica define la altura de la tarjeta (al abrir)
  const [layoutB, setLayoutB] = useState(false);
  const [img, setImg] = useState(0);

  const render = () => faceA.current && applyPeel(faceA.current, flap.current, state.current.p);

  const tweenTo = (p: number, duration = 0.9, ease = "power3.inOut", onComplete?: () => void) => {
    if (prefersReducedMotion()) {
      state.current.p = p;
      render();
      onComplete?.();
      return;
    }
    gsap.to(state.current, { p, duration, ease, onUpdate: render, onComplete, overwrite: true });
  };

  const full = () => (faceA.current ? faceA.current.offsetWidth + faceA.current.offsetHeight + 40 : 3000);

  const toggle = () => {
    if (!open) {
      setLayoutB(true);
      setOpen(true);
    } else {
      setOpen(false);
      tweenTo(0, 0.9, "power3.inOut", () => setLayoutB(false));
    }
  };

  // Tras ajustar el layout, despliega el pliegue completo
  useLayoutEffect(() => {
    if (open && layoutB) {
      render();
      tweenTo(full(), 1.1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, layoutB]);

  // Mantener la geometría al redimensionar
  useEffect(() => {
    const ro = new ResizeObserver(() => {
      if (open) state.current.p = full();
      render();
    });
    if (faceA.current) ro.observe(faceA.current);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // La altura cambió: recalcular posiciones de scroll
  useEffect(() => {
    const id = setTimeout(() => ScrollTrigger.refresh(), 60);
    return () => clearTimeout(id);
  }, [layoutB]);

  // Rotación suave de capturas
  useEffect(() => {
    if (project.images.length < 2 || prefersReducedMotion()) return;
    const id = setInterval(() => setImg((i) => (i + 1) % project.images.length), 4200);
    return () => clearInterval(id);
  }, [project.images.length]);

  const hint = (on: boolean) => {
    if (open) return;
    tweenTo(on ? 90 : 0, 0.6, "power3.out");
  };

  return (
    <article className="relative" data-reveal="card" aria-labelledby={`p-${project.id}`}>
      {/* ---------- CARA B: capa técnica ---------- */}
      <div
        className={`${layoutB ? "relative" : "absolute inset-0 overflow-hidden"} rounded-[28px] bg-ink text-bone p-6 sm:p-10 lg:p-12`}
        aria-hidden={!open}
        inert={!open}
      >
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <p className="eyebrow text-red">{"// "}{project.name} — tech layer</p>
          <button onClick={toggle} className="btn btn-ghost text-bone !py-2.5 !px-4 text-sm" data-cursor="hover">
            ↺ {peelClose}
          </button>
        </div>
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7 space-y-7">
            {[
              [labels.problem, project.problem],
              [labels.challenge, project.challenge],
              [labels.result, project.result],
            ].map(([k, v]) => (
              <div key={k}>
                <h4 className="eyebrow text-muted mb-2">{k}</h4>
                <p className="text-[1.02rem] leading-relaxed text-bone/90">{v}</p>
              </div>
            ))}
          </div>
          <div className="lg:col-span-5 space-y-7">
            <div>
              <h4 className="eyebrow text-muted mb-3">{labels.stack}</h4>
              <div className="flex flex-wrap gap-2">
                {project.stack.map((s) => (
                  <span key={s} className="chip text-bone/80">{s}</span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="eyebrow text-muted mb-2">{labels.data}</h4>
              <p className="font-mono text-sm text-bone">{project.data}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-ink-2 p-5">
              <h4 className="eyebrow text-red mb-4">{labels.security}</h4>
              <ul className="space-y-3">
                {project.security.map((s) => (
                  <li key={s.code + s.text} className="flex gap-3 text-sm leading-snug">
                    <span className="font-mono text-[0.7rem] mt-0.5 shrink-0 rounded bg-red/15 text-red px-1.5 py-0.5 h-fit">{s.code}</span>
                    <span className="text-bone/85">{s.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- CARA A: capa visual ---------- */}
      <div
        ref={faceA}
        className={`${layoutB ? "absolute inset-0" : "relative"} rounded-[28px] bg-bone text-ink overflow-hidden shadow-[0_30px_80px_-40px_rgba(0,0,0,0.35)]`}
        aria-hidden={open}
        inert={open}
      >
        <div className="grid lg:grid-cols-12 h-full">
          <div className="lg:col-span-7 relative aspect-[16/10] lg:aspect-auto lg:min-h-[520px] bg-ink overflow-hidden">
            {project.images.map((im, i) => (
              <Image
                key={im.src}
                src={im.src}
                alt={im.alt}
                fill
                sizes="(min-width: 1024px) 760px, 100vw"
                className="object-cover object-left-top transition-[opacity,transform] duration-[1200ms] ease-[cubic-bezier(.22,1,.36,1)]"
                style={{ opacity: i === img ? 1 : 0, transform: i === img ? "scale(1)" : "scale(1.04)" }}
                priority={index === 0 && i === 0}
              />
            ))}
            {project.images.length > 1 && (
              <div className="absolute bottom-4 left-4 flex gap-1.5" role="tablist" aria-label="Capturas">
                {project.images.map((im, i) => (
                  <button
                    key={im.src}
                    role="tab"
                    aria-selected={i === img}
                    aria-label={im.alt}
                    onClick={() => setImg(i)}
                    className={`h-1.5 rounded-full transition-all duration-500 ${i === img ? "w-8 bg-red" : "w-3 bg-white/60 hover:bg-white"}`}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="lg:col-span-5 flex flex-col p-6 sm:p-10">
            <div className="flex items-center justify-between mb-8">
              <span className="eyebrow text-red">0{index + 1}</span>
              <span className="chip text-ink/70">{project.tag}</span>
            </div>
            <h3 id={`p-${project.id}`} className="display text-[clamp(2rem,4vw,3.4rem)] mb-5">
              {project.name}
            </h3>
            <p className="text-[1.05rem] leading-relaxed text-ink/75 mb-8">{project.summary}</p>
            <dl className="grid grid-cols-2 gap-4 text-sm mb-10 border-t border-ink/10 pt-6">
              <div>
                <dt className="eyebrow text-ink/45 mb-1">{labels.role}</dt>
                <dd className="font-semibold">{project.role}</dd>
              </div>
              <div>
                <dt className="eyebrow text-ink/45 mb-1">{labels.period}</dt>
                <dd className="font-semibold">{project.period}</dd>
              </div>
            </dl>
            <div className="mt-auto flex flex-wrap gap-3 pr-14">
              {project.url && (
                <a href={project.url} target="_blank" rel="noopener noreferrer" className="btn btn-dark" data-cursor="hover">
                  {labels.visit} <span aria-hidden>↗</span>
                </a>
              )}
              <button onClick={toggle} className="btn btn-ghost text-ink hover:!bg-ink hover:!text-bone hover:!border-ink" data-cursor="hover">
                {peelOpen}
              </button>
            </div>
          </div>
        </div>

        {/* Esquina: invita a despegar */}
        <button
          onClick={toggle}
          onMouseEnter={() => hint(true)}
          onMouseLeave={() => hint(false)}
          onFocus={() => hint(true)}
          onBlur={() => hint(false)}
          className="absolute bottom-0 right-0 size-24 z-10 flex items-end justify-end p-3"
          aria-label={peelOpen}
          data-cursor="peel"
        >
          <span className="relative size-10 grid place-items-center">
            <span className="absolute inset-0 rounded-full bg-red animate-ping opacity-20" />
            <span className="relative size-3 rounded-full bg-red" />
          </span>
        </button>
      </div>

      {/* Solapa del pliegue (fuera de la cara A para no recortarse) */}
      <div className="absolute inset-0 pointer-events-none">
        <PeelFlap ref={flap} />
      </div>
    </article>
  );
}

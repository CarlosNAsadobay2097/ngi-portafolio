import Image from "next/image";
import FlowSteps from "../FlowSteps";
import PeelSheet from "../PeelSheet";
import type { Content } from "@/content/content";

function BrowserFrame({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return (
    <div className={`rounded-2xl overflow-hidden border border-white/10 bg-ink-2 shadow-[0_40px_100px_-40px_rgba(0,0,0,0.8)] ${className}`}>
      <div className="flex items-center gap-1.5 px-4 h-9 border-b border-white/10 bg-ink-3">
        <span className="size-2.5 rounded-full bg-white/15" />
        <span className="size-2.5 rounded-full bg-white/15" />
        <span className="size-2.5 rounded-full bg-white/15" />
        <span className="ml-3 h-4 w-40 rounded bg-white/5" />
      </div>
      <Image src={src} alt={alt} width={1600} height={900} sizes="(min-width:1024px) 640px, 100vw" className="w-full h-auto" />
    </div>
  );
}

export default function Marcas({ t, labels }: { t: Content["marcas"]; labels: Content["work"]["labels"] }) {
  return (
    <section id="ia" className="relative bg-ink text-bone overflow-hidden">
      <PeelSheet color="var(--paper)" side="left" />
      <div className="container-x py-28 lg:py-40">
        <div className="flex flex-wrap items-center gap-4 mb-6" data-reveal>
          <p className="eyebrow text-red">{t.label}</p>
          <span className="inline-flex items-center gap-2 rounded-md border-2 border-red px-3 py-1 font-mono text-[0.7rem] tracking-[0.18em] uppercase text-red rotate-[-3deg]">
            ● {t.badge}
          </span>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 mb-20 lg:mb-28">
          <div className="lg:col-span-7">
            <p className="font-mono text-sm text-bone/50 mb-4" data-reveal>{"> "}{t.name}</p>
            <h2 className="display text-[clamp(2.1rem,5vw,4.4rem)] max-w-[18ch]" data-split>{t.title}</h2>
          </div>
          <div className="lg:col-span-5 self-end">
            <p className="text-[1.15rem] leading-relaxed text-bone/80 border-l-2 border-red pl-6" data-reveal>{t.hook}</p>
          </div>
        </div>

        <div className="mb-24 lg:mb-32">
          <FlowSteps steps={t.steps} />
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7 relative min-h-[320px]">
            <BrowserFrame src={t.images[0].src} alt={t.images[0].alt} className="relative z-0 lg:w-[88%]" />
            <div className="lg:absolute lg:right-0 lg:top-[38%] lg:w-[70%] mt-6 lg:mt-0 z-10 relative" data-reveal>
              <BrowserFrame src={t.images[1].src} alt={t.images[1].alt} />
            </div>
          </div>
          <div className="lg:col-span-5 space-y-8 lg:pt-6">
            <div data-reveal>
              <h4 className="eyebrow text-muted mb-3">{labels.stack}</h4>
              <div className="flex flex-wrap gap-2">
                {t.stack.map((s) => (
                  <span key={s} className="chip text-bone/80">{s}</span>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-ink-2 p-6" data-reveal>
              <h4 className="eyebrow text-red mb-4">OWASP Top 10 · OWASP LLM Top 10</h4>
              <ul className="space-y-3">
                {t.security.map((s) => (
                  <li key={s.code} className="flex gap-3 text-sm leading-snug">
                    <span className="font-mono text-[0.7rem] mt-0.5 shrink-0 rounded bg-red/15 text-red px-1.5 py-0.5 h-fit min-w-12 text-center">{s.code}</span>
                    <span className="text-bone/85">{s.text}</span>
                  </li>
                ))}
              </ul>
            </div>
            <p className="font-mono text-xs leading-relaxed text-bone/45" data-reveal>※ {t.note}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

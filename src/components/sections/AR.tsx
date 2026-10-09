import Image from "next/image";
import PhoneParallax from "../PhoneParallax";
import PeelSheet from "../PeelSheet";
import ModelStage from "../ModelStage";
import { links, type Content } from "@/content/content";

export default function AR({ t, labels, peel = false }: { t: Content["ar"]; labels: Content["work"]["labels"]; peel?: boolean }) {
  const shots = [1, 2, 3, 5, 4, 7].map((n, i) => ({ src: `/img/macro/${n}.webp`, alt: `${t.name} — captura ${i + 1}` }));
  return (
    <section id="ar" className="relative bg-ink text-bone overflow-hidden border-t border-white/5">
      {peel && <PeelSheet color="var(--paper)" side="left" />}
      <div className="container-x py-28 lg:py-40 grid lg:grid-cols-12 gap-14 lg:gap-20">
        <div className="lg:col-span-6 lg:order-2">
          <div className="flex flex-wrap items-center gap-4 mb-6" data-reveal>
            <p className="eyebrow text-red">{t.label}</p>
            <span className="chip text-bone/60">{t.badge}</span>
          </div>
          <p className="font-mono text-sm text-bone/50 mb-4" data-reveal>{"> "}{t.name}</p>
          <h2 className="display text-[clamp(2.1rem,4.6vw,4rem)] mb-8 max-w-[16ch]" data-split>{t.title}</h2>
          <p className="text-[1.05rem] leading-relaxed text-bone/75 mb-10" data-reveal>{t.body}</p>

          <dl className="grid grid-cols-3 gap-4 mb-12 border-y border-white/10 py-8">
            {t.stats.map((s, i) => (
              <div key={s.l} data-reveal data-delay={i * 0.08}>
                <dt className="display text-[clamp(2rem,4vw,3.4rem)] text-red">{s.n}</dt>
                <dd className="text-sm text-bone/60 mt-2 leading-snug">{s.l}</dd>
              </div>
            ))}
          </dl>

          <div className="space-y-7 mb-12">
            <div data-reveal>
              <h4 className="eyebrow text-muted mb-2">{labels.challenge}</h4>
              <p className="leading-relaxed text-bone/85">{t.challenge}</p>
            </div>
            <div data-reveal>
              <h4 className="eyebrow text-muted mb-2">{labels.result}</h4>
              <p className="leading-relaxed text-bone/85">{t.result}</p>
            </div>
            <div className="flex flex-wrap gap-2" data-reveal>
              {t.stack.map((s) => (
                <span key={s} className="chip text-bone/70">{s}</span>
              ))}
            </div>
          </div>

          {/* Pruébala */}
          <div className="rounded-3xl bg-bone text-ink p-6 sm:p-8 grid sm:grid-cols-[120px_1fr] gap-6 items-center" data-reveal>
            <a href={links.macroTarget} download className="block rotate-[-4deg] hover:rotate-0 transition-transform duration-500 shadow-xl" aria-label={t.ctaTarget}>
              <Image src="/img/macro/target.webp" alt="Marcador AR de Macroinvertebrados" width={497} height={702} className="w-full h-auto rounded-sm" />
            </a>
            <div>
              <h3 className="font-display font-semibold text-xl mb-3">{t.howTo}</h3>
              <ol className="space-y-1.5 text-sm text-ink/75 mb-5 list-decimal pl-4">
                {t.steps.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>
              <div className="flex flex-wrap gap-2">
                <a href={links.macroTarget} download className="btn btn-red !py-2.5 !px-4 text-sm" data-cursor="hover">
                  ↓ {t.ctaTarget}
                </a>
                <a href={links.macro} target="_blank" rel="noopener noreferrer" className="btn btn-dark !py-2.5 !px-4 text-sm" data-cursor="hover">
                  {t.ctaSite} ↗
                </a>
              </div>
              <p className="font-mono text-[0.7rem] text-ink/45 mt-4">⚿ {t.codeNote}</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 lg:order-1 space-y-6">
          <div data-reveal>
            <ModelStage t={t.viewer} src="/models/diptera-blephariceridae.glb" />
          </div>
          <PhoneParallax images={shots} />
        </div>
      </div>
    </section>
  );
}

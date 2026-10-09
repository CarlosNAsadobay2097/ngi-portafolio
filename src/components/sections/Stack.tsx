import PeelSheet from "../PeelSheet";
import type { Content } from "@/content/content";

const MARQUEE = ["React", "Next.js", "Node.js", "Python", "Django", "Firebase", "PostgreSQL", "MongoDB", "Groq", "GSAP", "Figma", "A-Frame", "OWASP"];

export default function Stack({ t }: { t: Content["stack"] }) {
  return (
    <section id="stack" className="relative bg-ink text-bone overflow-hidden">
      <PeelSheet color="var(--paper)" side="left" />
      <div className="py-10 border-b border-white/5 overflow-hidden" aria-hidden>
        <div className="marquee flex w-max gap-10 whitespace-nowrap">
          {[...MARQUEE, ...MARQUEE].map((m, i) => (
            <span key={i} className="display text-[clamp(2.5rem,7vw,6rem)] text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.18)] flex items-center gap-10">
              {m} <span className="inline-block size-3 rounded-full bg-red" />
            </span>
          ))}
        </div>
      </div>

      <div className="container-x py-24 lg:py-36">
        <p className="eyebrow text-red mb-6" data-reveal>{t.label}</p>
        <h2 className="display text-[clamp(2.3rem,5.6vw,5rem)] mb-16 max-w-[14ch]" data-split>{t.title}</h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {t.groups.map((g, i) => (
            <div
              key={g.name}
              className="group rounded-3xl border border-white/10 bg-ink-2 p-6 transition-colors duration-500 hover:border-red/60 hover:bg-[#1c1415]"
              data-reveal
              data-delay={(i % 4) * 0.06}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display font-semibold text-lg">{g.name}</h3>
                <span className="font-mono text-xs text-bone/35 group-hover:text-red transition-colors">0{i + 1}</span>
              </div>
              <ul className="space-y-2.5">
                {g.items.map((it) => (
                  <li key={it} className="flex items-start gap-2.5 text-[0.93rem] text-bone/75">
                    <span className="mt-2 size-1.5 rounded-full bg-red/70 shrink-0" />
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-3xl border border-red/40 bg-[linear-gradient(135deg,rgba(223,6,30,0.14),transparent_60%)] p-6 sm:p-10 grid lg:grid-cols-12 gap-8 items-center" data-reveal>
          <div className="lg:col-span-5">
            <p className="eyebrow text-red mb-3">OWASP · Security by design</p>
            <h3 className="display text-[clamp(1.6rem,2.6vw,2.3rem)]">{t.selfTitle}</h3>
          </div>
          <ul className="lg:col-span-7 grid sm:grid-cols-2 gap-x-8 gap-y-3">
            {t.self.map((s) => (
              <li key={s} className="flex gap-3 text-sm text-bone/85 font-mono leading-snug">
                <span className="text-red">✓</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

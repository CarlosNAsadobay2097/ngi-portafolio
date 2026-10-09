import LiveEmbed from "../LiveEmbed";
import PeelSheet from "../PeelSheet";
import { links, type Content } from "@/content/content";

export default function OpenSource({ t, labels }: { t: Content["os"]; labels: Content["work"]["labels"] }) {
  return (
    <section id="open-source" className="relative bg-paper text-ink">
      <PeelSheet color="var(--ink)" side="right" />
      <div className="container-x py-28 lg:py-40">
        <div className="flex flex-wrap items-center gap-4 mb-6" data-reveal>
          <p className="eyebrow text-red">{t.label}</p>
          <span className="chip text-ink/60">{t.badge}</span>
        </div>
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="font-mono text-sm text-ink/50 mb-4" data-reveal>{"> "}{t.name}</p>
            <h2 className="display text-[clamp(2.1rem,4.6vw,4rem)] mb-8" data-split>{t.title}</h2>
            <p className="text-[1.05rem] leading-relaxed text-ink/75 mb-10" data-reveal>{t.body}</p>
            <div className="space-y-7 mb-10">
              <div data-reveal>
                <h4 className="eyebrow text-ink/45 mb-2">{labels.challenge}</h4>
                <p className="leading-relaxed text-ink/80">{t.challenge}</p>
              </div>
              <div data-reveal>
                <h4 className="eyebrow text-ink/45 mb-2">{labels.result}</h4>
                <p className="leading-relaxed text-ink/80">{t.result}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3" data-reveal>
              <a href={links.booksRepo} target="_blank" rel="noopener noreferrer" className="btn btn-dark" data-cursor="hover">
                <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden>
                  <path d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.7 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
                </svg>
                {t.ctaRepo}
              </a>
              <a href={links.booksLive} target="_blank" rel="noopener noreferrer" className="btn btn-ghost text-ink hover:!bg-ink hover:!text-bone hover:!border-ink" data-cursor="hover">
                {t.ctaLive} ↗
              </a>
            </div>
          </div>
          <div className="lg:col-span-7" data-reveal>
            <p className="eyebrow text-ink/50 mb-4">◉ {t.liveTitle}</p>
            <LiveEmbed src={links.booksLive} poster="/img/libros/1.webp" title="Fábrica de Historias" loadLabel={t.liveLoad} />
            <div className="flex flex-wrap gap-2 mt-6">
              {t.stack.map((s) => (
                <span key={s} className="chip text-ink/60">{s}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

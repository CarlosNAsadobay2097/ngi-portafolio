import ProjectCard from "../ProjectCard";
import PeelSheet from "../PeelSheet";
import type { Content } from "@/content/content";

export default function Work({ t, projects }: { t: Content["work"]; projects: Content["projects"] }) {
  return (
    <section id="proyectos" className="relative bg-paper text-ink">
      <PeelSheet color="var(--red)" side="right" />
      <div className="container-x py-28 lg:py-40">
        <div className="grid lg:grid-cols-12 gap-8 mb-16 lg:mb-24 items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow text-red mb-6" data-reveal>{t.label}</p>
            <h2 className="display text-[clamp(2.3rem,5.6vw,5rem)] max-w-[14ch]" data-split>{t.title}</h2>
          </div>
          <p className="lg:col-span-5 text-[1.05rem] leading-relaxed text-ink/70" data-reveal>
            {t.intro}
          </p>
        </div>
        <div className="space-y-10 lg:space-y-16">
          {projects.map((p, i) => (
            <ProjectCard key={p.id} project={p} labels={t.labels} peelOpen={t.peelOpen} peelClose={t.peelClose} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

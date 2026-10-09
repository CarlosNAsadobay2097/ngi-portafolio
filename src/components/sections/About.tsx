import HalftonePortrait from "../HalftonePortrait";
import type { Content } from "@/content/content";

export default function About({ t }: { t: Content["about"] }) {
  return (
    <section id="perfil" className="relative bg-red text-white overflow-hidden">
      <div className="container-x py-28 lg:py-40 grid gap-16 lg:grid-cols-12 items-center">
        <div className="lg:col-span-7">
          <p className="eyebrow text-white/70 mb-6" data-reveal>{t.label}</p>
          <h2 className="display text-[clamp(2.3rem,5.6vw,5rem)] mb-10 max-w-[14ch]" data-split>
            {t.title}
          </h2>
          <div className="space-y-5 max-w-[60ch] text-[1.08rem] leading-relaxed text-white/90">
            {t.body.map((p, i) => (
              <p key={i} data-reveal data-delay={i * 0.08}>{p}</p>
            ))}
          </div>
          <dl className="mt-12 grid sm:grid-cols-2 gap-x-10 gap-y-6 border-t border-white/25 pt-8">
            {t.facts.map((f, i) => (
              <div key={f.k} data-reveal data-delay={i * 0.06}>
                <dt className="eyebrow text-white/60 mb-1">{f.k}</dt>
                <dd className="font-semibold text-lg">{f.v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="lg:col-span-5 lg:pl-6">
          <HalftonePortrait src="/img/carlos.webp" alt="Carlos Asadobay" hint={t.lensHint} />
        </div>
      </div>
    </section>
  );
}

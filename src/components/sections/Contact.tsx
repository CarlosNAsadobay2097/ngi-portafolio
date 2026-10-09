import ContactForm from "../ContactForm";
import PeelSheet from "../PeelSheet";
import Logo from "../Logo";
import { links, type Content } from "@/content/content";

export default function Contact({ t, footer, locale, cvHref }: { t: Content["contact"]; footer: Content["footer"]; locale: string; cvHref: string }) {
  const socials = [
    ["Email", `mailto:${links.email}`, links.email],
    ["WhatsApp", links.whatsapp, "+593 96 906 7253"],
    ["LinkedIn", links.linkedin, "carlos-asadobay"],
    ["GitHub", links.github, "CarlosNAsadobay2097"],
  ] as const;
  return (
    <>
      <section id="contacto" className="relative bg-red text-white overflow-hidden">
        <PeelSheet color="var(--ink)" side="right" />
        <div className="container-x py-28 lg:py-40 grid lg:grid-cols-12 gap-16">
          <div className="lg:col-span-6">
            <p className="eyebrow text-white/70 mb-6" data-reveal>{t.label}</p>
            <h2 className="display text-[clamp(2.2rem,4.6vw,4.6rem)] mb-8" data-split>{t.title}</h2>
            <p className="text-lg text-white/85 mb-12 max-w-[40ch]" data-reveal>{t.sub}</p>
            <ul className="divide-y divide-white/20 border-y border-white/20">
              {socials.map(([k, href, label]) => (
                <li key={k} data-reveal>
                  <a
                    href={href}
                    target={href.startsWith("mailto") ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between py-4 gap-4"
                    data-cursor="hover"
                  >
                    <span className="eyebrow text-white/65 w-24">{k}</span>
                    <span className="font-semibold truncate flex-1">{label}</span>
                    <span className="transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1">↗</span>
                  </a>
                </li>
              ))}
            </ul>
            <a href={cvHref} download className="btn btn-dark mt-10" data-cursor="hover">
              CV (PDF) ↓
            </a>
          </div>
          <div className="lg:col-span-6 lg:pl-10 lg:pt-20" data-reveal>
            <ContactForm t={t} locale={locale} />
          </div>
        </div>
      </section>

      <footer className="bg-ink text-bone/60">
        <div className="container-x py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <span className="size-9 block">
              <Logo flat />
            </span>
            <p className="text-sm">© {new Date().getFullYear()} · {footer.rights}</p>
          </div>
          <p className="font-mono text-xs">{footer.built}</p>
          <a href="#top" className="eyebrow link-u hover:text-bone" data-cursor="hover">
            ↑ {footer.top}
          </a>
        </div>
      </footer>
    </>
  );
}

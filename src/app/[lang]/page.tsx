import { notFound } from "next/navigation";
import { getContent, links, SHOW_CONFIDENTIAL_PROJECT } from "@/content/content";
import { isLocale } from "@/lib/i18n";
import SmoothScroll from "@/components/SmoothScroll";
import Intro from "@/components/Intro";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Reveals from "@/components/Reveals";
import Cursor from "@/components/Cursor";
import Chat from "@/components/Chat";
import About from "@/components/sections/About";
import Work from "@/components/sections/Work";
import Marcas from "@/components/sections/Marcas";
import AR from "@/components/sections/AR";
import OpenSource from "@/components/sections/OpenSource";
import Stack from "@/components/sections/Stack";
import Contact from "@/components/sections/Contact";

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const c = getContent(lang);
  const cv = links.cv[lang];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Carlos Asadobay",
    jobTitle: "Full-Stack & Creative Developer",
    address: { "@type": "PostalAddress", addressLocality: "Riobamba", addressCountry: "EC" },
    alumniOf: "Universidad San Francisco de Quito",
    sameAs: [links.github, links.linkedin],
  };

  return (
    <>
      <SmoothScroll />
      <Intro skipLabel={c.intro.skip} tagline="Carlos Asadobay — Full-Stack & Creative Developer" />
      <Cursor />
      <Nav t={c.nav} locale={lang} cvHref={cv} />
      <main id="contenido">
        <Hero t={c.hero} cvHref={cv} />
        <About t={c.about} />
        <Work t={c.work} projects={c.projects} />
        {SHOW_CONFIDENTIAL_PROJECT && <Marcas t={c.marcas} labels={c.work.labels} />}
        <AR t={c.ar} labels={c.work.labels} peel={!SHOW_CONFIDENTIAL_PROJECT} />
        <OpenSource t={c.os} labels={c.work.labels} />
        <Stack t={c.stack} />
        <Contact t={c.contact} footer={c.footer} locale={lang} cvHref={cv} />
      </main>
      <Chat t={c.chat} locale={lang} />
      <Reveals />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}

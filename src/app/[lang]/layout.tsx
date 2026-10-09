import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import "../globals.css";
import { getContent } from "@/content/content";
import { isLocale } from "@/lib/i18n";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://ngi-portafolio.vercel.app";

// La CSP usa un nonce por petición, por eso la página se renderiza en cada request.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const c = getContent(lang);
  return {
    metadataBase: new URL(SITE),
    title: c.meta.title,
    description: c.meta.description,
    authors: [{ name: "Carlos Asadobay" }],
    alternates: { canonical: `/${lang}`, languages: { es: "/es", en: "/en" } },
    openGraph: {
      type: "website",
      url: `/${lang}`,
      title: c.meta.title,
      description: c.meta.description,
      locale: lang === "es" ? "es_EC" : "en_US",
      images: [{ url: "/og.png", width: 1200, height: 630, alt: "NGi — Carlos Asadobay" }],
    },
    twitter: { card: "summary_large_image", title: c.meta.title, description: c.meta.description, images: ["/og.png"] },
    icons: { icon: [{ url: "/icon.svg", type: "image/svg+xml" }, { url: "/icon-32.png", sizes: "32x32" }], apple: "/apple-icon.png" },
  };
}

export const viewport: Viewport = { themeColor: "#0d0c0c", width: "device-width", initialScale: 1 };

export default async function LangLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        {/* Activa la cortina roja si venimos de un cambio de idioma (evita parpadeo) */}
        <script
          nonce={nonce}
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `try{if(sessionStorage.getItem('ngi-curtain')==='1'){document.documentElement.classList.add('curtain-in');sessionStorage.removeItem('ngi-curtain')}}catch(e){}`,
          }}
        />
      </head>
      <body className="grain">{children}</body>
    </html>
  );
}

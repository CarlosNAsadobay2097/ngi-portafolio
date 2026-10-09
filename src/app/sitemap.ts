import type { MetadataRoute } from "next";
const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://ngi-portafolio.vercel.app";
export default function sitemap(): MetadataRoute.Sitemap {
  return ["es", "en"].map((l) => ({
    url: `${SITE}/${l}`,
    lastModified: new Date(),
    alternates: { languages: { es: `${SITE}/es`, en: `${SITE}/en` } },
  }));
}

import { NextResponse, type NextRequest } from "next/server";
import { locales, defaultLocale } from "@/lib/i18n";

/**
 * 1) Redirige "/" al idioma preferido del visitante (/es o /en).
 * 2) Genera una Content-Security-Policy estricta con nonce por petición
 *    (OWASP A03 Injection / XSS y A05 Security Misconfiguration).
 */
const FRAME_SOURCES = [
  "https://fabrica-de-historias-unae.netlify.app",
  "https://chakray-kamayuk.vercel.app",
];

function preferredLocale(req: NextRequest) {
  const header = req.headers.get("accept-language") ?? "";
  return header.toLowerCase().startsWith("en") ? "en" : defaultLocale;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const hasLocale = locales.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
  if (!hasLocale && !pathname.startsWith("/api")) {
    const url = req.nextUrl.clone();
    url.pathname = `/${preferredLocale(req)}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url);
  }

  const nonce = btoa(crypto.randomUUID());
  const isDev = process.env.NODE_ENV !== "production";
  // upgrade-insecure-requests solo en HTTPS (en localhost rompería la carga de recursos)
  const isHttps = req.nextUrl.protocol === "https:" || req.headers.get("x-forwarded-proto") === "https";
  const csp = [
    `default-src 'self'`,
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`,
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data: blob:`,
    `font-src 'self'`,
    `connect-src 'self' blob: data:${isDev ? " ws:" : ""}`,
    `frame-src ${FRAME_SOURCES.join(" ")}`,
    `frame-ancestors 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `object-src 'none'`,
    ...(isHttps ? [`upgrade-insecure-requests`] : []),
  ].join("; ");

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const res = NextResponse.next({ request: { headers: requestHeaders } });
  res.headers.set("Content-Security-Policy", csp);
  return res;
}

export const config = {
  matcher: [
    {
      source: "/((?!_next/static|_next/image|img/|files/|models/|og.png|icon|apple-icon|favicon|robots.txt|sitemap.xml).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};

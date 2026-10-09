import { NextResponse } from "next/server";
import { z } from "zod";
import { clientIp, rateLimit, sameOrigin } from "@/lib/rate-limit";

export const runtime = "nodejs";

const Body = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(120),
  message: z.string().trim().min(10).max(2000),
  website: z.string().max(200).optional().nullable(), // honeypot: debe venir vacío
  elapsed: z.number().int().nonnegative(),
  locale: z.enum(["es", "en"]).default("es"),
});

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function POST(req: Request) {
  if (!sameOrigin(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const raw = await req.text();
  if (raw.length > 6000) return NextResponse.json({ error: "Payload too large" }, { status: 413 });

  let parsed;
  try {
    parsed = Body.safeParse(JSON.parse(raw));
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
  if (!parsed.success) return NextResponse.json({ error: "Invalid fields" }, { status: 400 });
  const { name, email, message, elapsed, locale } = parsed.data;

  // Bots: rellenan el honeypot o envían en menos de 3 s → respondemos OK sin enviar nada
  if (parsed.data.website || elapsed < 3000) return NextResponse.json({ ok: true });

  const ip = clientIp(req);
  if (!rateLimit(`contact:${ip}`, 3, 600_000).ok) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!key || !to) return NextResponse.json({ error: "Not configured" }, { status: 503 });

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL || "Portafolio NGi <onboarding@resend.dev>",
        to: [to],
        reply_to: email,
        subject: `Portafolio · Nuevo mensaje de ${name.slice(0, 60)}`,
        text: `Nombre: ${name}\nCorreo: ${email}\nIdioma: ${locale}\n\n${message}`,
        html: `<p><b>Nombre:</b> ${escapeHtml(name)}<br/><b>Correo:</b> ${escapeHtml(email)}<br/><b>Idioma:</b> ${locale}</p><p style="white-space:pre-wrap">${escapeHtml(message)}</p>`,
      }),
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) {
      console.error("Resend error", res.status);
      return NextResponse.json({ error: "Send failed" }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Contact failure", e);
    return NextResponse.json({ error: "Send failed" }, { status: 502 });
  }
}

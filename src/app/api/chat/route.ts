import { NextResponse } from "next/server";
import { z } from "zod";
import { buildSystemPrompt } from "@/lib/profile";
import { clientIp, rateLimit, sameOrigin } from "@/lib/rate-limit";

export const runtime = "nodejs";

// Validación estricta de entrada (OWASP A03) y límites de tamaño (LLM10)
// Las respuestas largas del asistente se recortan en vez de rechazar la petición.
const Body = z.object({
  locale: z.enum(["es", "en"]).default("es"),
  messages: z
    .array(
      z
        .object({
          role: z.enum(["user", "assistant"]),
          content: z.string().trim().min(1).max(4000),
        })
        .transform((m) => ({ ...m, content: m.content.slice(0, m.role === "user" ? 600 : 1200) })),
    )
    .min(1)
    .max(12)
    .transform((arr) => arr.slice(-8))
    .refine((arr) => arr[arr.length - 1]?.role === "user", "El último mensaje debe ser del usuario"),
});

// Modelos de Groq en orden de preferencia. El primero que responda se recuerda
// para no perder tiempo probando modelos retirados en cada mensaje.
const DEFAULT_MODELS = ["openai/gpt-oss-120b", "llama-3.3-70b-versatile", "openai/gpt-oss-20b", "llama-3.1-8b-instant"];
let workingModel: string | null = null;

const MSG = {
  es: { limit: "Has hecho muchas preguntas seguidas. Espera un momento e inténtalo de nuevo.", off: "El asistente no está disponible ahora. Escríbeme a carlos1asadobay@gmail.com." },
  en: { limit: "You've asked a lot of questions in a row. Please wait a moment and try again.", off: "The assistant isn't available right now. Email me at carlos1asadobay@gmail.com." },
};

export async function POST(req: Request) {
  if (!sameOrigin(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const raw = await req.text();
  if (raw.length > 16000) return NextResponse.json({ error: "Payload too large" }, { status: 413 });

  let parsed;
  try {
    parsed = Body.safeParse(JSON.parse(raw));
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
  if (!parsed.success) return NextResponse.json({ error: "Bad request" }, { status: 400 });
  const { messages, locale } = parsed.data;

  const ip = clientIp(req);
  const minute = rateLimit(`chat:m:${ip}`, 8, 60_000);
  const day = rateLimit(`chat:d:${ip}`, 60, 86_400_000);
  if (!minute.ok || !day.ok) {
    return NextResponse.json({ error: MSG[locale].limit }, { status: 429, headers: { "Retry-After": String(Math.max(minute.retryAfter, day.retryAfter)) } });
  }

  // .trim() y sin comillas: evita errores por espacios o comillas pegadas en .env.local
  const key = process.env.GROQ_API_KEY?.trim().replace(/^["']|["']$/g, "");
  if (!key) return NextResponse.json({ error: MSG[locale].off }, { status: 503 });

  const isDev = process.env.NODE_ENV !== "production";
  // Si un modelo se retira en Groq, se prueba el siguiente automáticamente
  const models = [workingModel, process.env.GROQ_MODEL?.trim(), ...DEFAULT_MODELS].filter(
    (m, i, arr): m is string => !!m && arr.indexOf(m) === i,
  );

  let lastError = "";
  for (const model of models) {
    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          temperature: 0.4,
          max_tokens: 350,
          messages: [{ role: "system", content: buildSystemPrompt(locale) }, ...messages],
        }),
        signal: AbortSignal.timeout(20_000),
      });

      if (res.ok) {
        if (workingModel !== model) console.info(`[chat] Usando el modelo de Groq: ${model}`);
        workingModel = model;
        const data = await res.json();
        const reply: string = data?.choices?.[0]?.message?.content?.trim() ?? "";
        return NextResponse.json({ reply: reply.slice(0, 2000) }, { headers: { "Cache-Control": "no-store" } });
      }

      const body = await res.json().catch(() => ({}));
      const msg: string = body?.error?.message ?? res.statusText;
      lastError = `Groq ${res.status} (${model}): ${msg}`;
      console.error("[chat]", lastError);

      // Solo vale la pena probar otro modelo si el problema es el modelo
      const modelProblem = res.status === 404 || (res.status === 400 && /model/i.test(msg));
      if (modelProblem && workingModel === model) workingModel = null;
      if (!modelProblem) break;
    } catch (e) {
      lastError = `No se pudo conectar con Groq: ${(e as Error).message}`;
      console.error("[chat]", lastError);
      break;
    }
  }

  // En desarrollo mostramos el motivo real para depurar; en producción, mensaje genérico
  return NextResponse.json({ error: isDev ? `${MSG[locale].off}\n\n[dev] ${lastError}` : MSG[locale].off }, { status: 502 });
}

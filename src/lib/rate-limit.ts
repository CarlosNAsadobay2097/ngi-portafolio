/**
 * Rate limiting en memoria (ventana deslizante por IP).
 * En Vercel cada instancia tiene su propia memoria: es una primera barrera
 * suficiente para un portafolio. Para algo más estricto, usar Upstash Redis.
 * (OWASP A04 / LLM10: consumo no acotado)
 */
const buckets = new Map<string, number[]>();

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= limit) {
    buckets.set(key, hits);
    return { ok: false, retryAfter: Math.ceil((windowMs - (now - hits[0])) / 1000) };
  }
  hits.push(now);
  buckets.set(key, hits);
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) if (!v.some((t) => now - t < windowMs)) buckets.delete(k);
  }
  return { ok: true, retryAfter: 0 };
}

export function clientIp(req: Request) {
  const fwd = req.headers.get("x-forwarded-for");
  return (fwd?.split(",")[0] ?? req.headers.get("x-real-ip") ?? "anon").trim();
}

/** Acepta solo peticiones del mismo origen (defensa CSRF básica). */
export function sameOrigin(req: Request) {
  const origin = req.headers.get("origin");
  if (!origin) return true; // algunos navegadores no la envían en same-origin
  try {
    return new URL(origin).host === req.headers.get("host");
  } catch {
    return false;
  }
}

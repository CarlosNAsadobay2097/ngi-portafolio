# NGi · Portafolio de Carlos Asadobay

Portafolio **Full-Stack & Creative Developer** con el concepto **“El Pliegue”**: homenaje a la esquina doblada del logo NGi. Cada proyecto tiene una capa visual y una capa técnica que se despega.

**Stack:** Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · GSAP (ScrollTrigger + SplitText) · Lenis · Groq (IA) · Resend (correo) · Vercel.

---

## 1. Correr en tu computadora

Requisitos: [Node.js 20 o superior](https://nodejs.org).

```bash
npm install
cp .env.example .env.local   # en Windows: copy .env.example .env.local
npm run dev
```

Abre http://localhost:3000 (redirige a `/es` o `/en` según el idioma del navegador).

> Sin claves en `.env.local` el sitio funciona igual; solo el chat y el formulario muestran un mensaje de “no disponible”.

## 2. Subir a GitHub

1. Crea un repositorio vacío en GitHub (por ejemplo `ngi-portafolio`).
2. Dentro de esta carpeta:

```bash
git init
git add .
git commit -m "Portafolio NGi v1"
git branch -M main
git remote add origin https://github.com/CarlosNAsadobay2097/ngi-portafolio.git
git push -u origin main
```

`.gitignore` ya excluye `node_modules`, `.next` y los archivos `.env*.local`, así que tus claves **nunca** se suben.

## 3. Publicar en Vercel

1. Entra a [vercel.com/new](https://vercel.com/new) e importa el repositorio. Vercel detecta Next.js solo.
2. Antes de pulsar **Deploy**, abre **Environment Variables** y agrega:

| Variable | Valor |
|---|---|
| `GROQ_API_KEY` | Tu clave de https://console.groq.com/keys |
| `GROQ_MODEL` | (opcional, déjalo vacío: se elige un modelo disponible solo) |
| `RESEND_API_KEY` | Tu clave de https://resend.com/api-keys |
| `CONTACT_TO_EMAIL` | `carlos1asadobay@gmail.com` |
| `CONTACT_FROM_EMAIL` | `Portafolio NGi <onboarding@resend.dev>` |
| `NEXT_PUBLIC_SITE_URL` | La URL final, p. ej. `https://ngi-portafolio.vercel.app` |

3. **Deploy**. Cada `git push` a `main` vuelve a publicar automáticamente.

> **Resend:** mientras no verifiques un dominio propio, el remitente `onboarding@resend.dev` solo puede enviar al correo con el que creaste tu cuenta de Resend. Crea la cuenta con `carlos1asadobay@gmail.com` o verifica tu dominio después.

## 4. Editar contenido

| Qué | Dónde |
|---|---|
| **Todos los textos (ES y EN)** | `src/content/content.ts` |
| Enlaces (GitHub, LinkedIn, sitios, CV) | objeto `links` en `src/content/content.ts` |
| Ocultar/mostrar el proyecto confidencial | `SHOW_CONFIDENTIAL_PROJECT` en `src/content/content.ts` |
| Imágenes | `public/img/…` (formato WebP) |
| CV y marcador AR descargables | `public/files/` |
| Colores de marca | variables `:root` en `src/app/globals.css` |
| Conocimiento del asistente IA | se genera solo desde `content.ts` (`src/lib/profile.ts`) |

Para el CV en inglés: guarda `public/files/CV_Carlos_Asadobay_EN.pdf` y cambia `cv.en` en `links`.

## 5. Estructura

```
src/
├─ app/
│  ├─ [lang]/layout.tsx · page.tsx   ← página ES / EN
│  ├─ api/chat/route.ts              ← asistente IA (Groq)
│  ├─ api/contact/route.ts           ← formulario (Resend)
│  └─ globals.css                    ← tokens de marca y estilos base
├─ components/
│  ├─ Intro.tsx      ← animación del logo
│  ├─ Hero.tsx       ← círculo que crece con el scroll
│  ├─ ProjectCard.tsx← tarjeta con el pliegue (capa técnica)
│  ├─ PeelSheet.tsx  ← transición de sección que se despega
│  ├─ HalftonePortrait.tsx ← foto en semitono + lupa
│  └─ sections/…     ← cada sección del sitio
├─ content/content.ts← textos ES / EN
├─ lib/              ← i18n, GSAP, geometría del pliegue, rate limit
└─ middleware.ts     ← idioma + Content-Security-Policy con nonce
```

## 6. Seguridad (OWASP)

- **CSP estricta con nonce** por petición (`src/middleware.ts`), `frame-ancestors 'none'`, `object-src 'none'`.
- **Cabeceras:** HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy, COOP (`next.config.ts`).
- **APIs:** validación con `zod`, límite de tamaño, verificación de origen, rate limiting por IP, honeypot y trampa de tiempo anti-spam, escape de HTML en correos.
- **IA (OWASP LLM Top 10):** instrucciones de sistema acotadas, historial y `max_tokens` limitados, clave solo en el servidor.

Cuando esté publicado, verifica en https://developer.mozilla.org/observatory y https://securityheaders.com.

> El rate limit es en memoria (por instancia de Vercel). Si algún día recibes mucho tráfico, cámbialo por Upstash Redis.

## 7. Accesibilidad

Respeta `prefers-reduced-motion` (sin intro ni animaciones pesadas), navegación por teclado, enlace “Saltar al contenido”, textos alternativos y contraste alto.

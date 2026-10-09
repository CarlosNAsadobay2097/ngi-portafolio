import type { Locale } from "@/lib/i18n";

/* ------------------------------------------------------------------
 * TODO el texto del portafolio vive aquí (ES / EN).
 * Para corregir un texto, cámbialo en ambos idiomas.
 * ------------------------------------------------------------------ */

export const links = {
  email: "carlos1asadobay@gmail.com",
  whatsapp: "https://wa.me/593969067253",
  github: "https://github.com/CarlosNAsadobay2097",
  linkedin: "https://www.linkedin.com/in/carlos-asadobay-693b0a2a8/",
  chakray: "https://chakray-kamayuk.vercel.app/",
  clariplay: "https://clariplay.vercel.app/",
  macro: "https://macroinvertebrados-ar.com/",
  macroTarget: "/files/macroinvertebrados-ar-target.pdf",
  booksRepo: "https://github.com/CarlosNAsadobay2097/pdf-book-viewer",
  booksLive: "https://fabrica-de-historias-unae.netlify.app/",
  cv: { es: "/files/CV_Carlos_Asadobay_ES.pdf", en: "/files/CV_Carlos_Asadobay_ES.pdf" },
};

/** Muestra u oculta la sección del proyecto confidencial con un solo cambio. */
export const SHOW_CONFIDENTIAL_PROJECT = true;

type SecurityItem = { code: string; text: string };
type Project = {
  id: string;
  name: string;
  tag: string;
  period: string;
  role: string;
  url?: string;
  images: { src: string; alt: string }[];
  summary: string;
  problem: string;
  challenge: string;
  result: string;
  stack: string[];
  data: string;
  security: SecurityItem[];
};

const es = {
  meta: {
    title: "Carlos Asadobay — Full-Stack & Creative Developer",
    description:
      "Portafolio de Carlos Asadobay (NGi): desarrollo full-stack, backend, UI/UX, IA aplicada, WebAR y 3D. Riobamba, Ecuador · Remoto.",
  },
  nav: {
    about: "Perfil",
    work: "Proyectos",
    ai: "IA",
    ar: "AR / 3D",
    os: "Open Source",
    stack: "Stack",
    contact: "Contacto",
    switchTo: "EN",
    switchLabel: "Switch to English",
    skip: "Saltar al contenido",
  },
  intro: { skip: "Saltar intro" },
  hero: {
    kicker: "Full-Stack & Creative Developer",
    lineA: "Diseño la experiencia.",
    lineB: "Construyo lo que la sostiene.",
    sub: "Web · UI/UX · Backend · IA aplicada · WebAR. Uno el lado creativo con código sólido, seguro y listo para producción.",
    ctaWork: "Ver proyectos",
    ctaCv: "Descargar CV",
    location: "Riobamba, Ecuador · Remoto / Híbrido",
    scroll: "Despliega",
    ring: "FULL-STACK · CREATIVE DEV · BACKEND · UI/UX · IA APLICADA · WEBAR · ",
  },
  about: {
    label: "01 — Perfil",
    title: "Dos capas, un mismo desarrollador.",
    body: [
      "Soy Carlos Asadobay, desarrollador full-stack y creativo, licenciado en Diseño de Medios Interactivos por la Universidad San Francisco de Quito (2024).",
      "Construyo aplicaciones web, eCommerce y plataformas educativas con React, Next.js y Node.js. Diseño la interfaz en Figma y también la arquitectura que la sostiene: APIs, bases de datos SQL y NoSQL, seguridad basada en OWASP e integración de IA.",
      "Trabajo con IA agéntica en mi flujo diario: para crear herramientas, automatizar pruebas de webs y apps, y entregar más rápido sin sacrificar calidad.",
    ],
    facts: [
      { k: "Base", v: "Riobamba, Ecuador" },
      { k: "Modalidad", v: "Remoto / Híbrido" },
      { k: "Idiomas", v: "Español nativo · Inglés B2" },
      { k: "Formación", v: "Lic. Diseño de Medios Interactivos — USFQ" },
    ],
    lensHint: "Pasa el cursor sobre la foto",
  },
  work: {
    label: "02 — Proyectos",
    title: "Lo que se ve, y lo que lo sostiene.",
    intro:
      "Cada proyecto tiene dos caras. Despliega la esquina para ver la capa técnica: arquitectura, datos y las medidas de seguridad OWASP aplicadas.",
    peelOpen: "Ver capa técnica",
    peelClose: "Ver capa visual",
    labels: {
      problem: "El problema",
      challenge: "El reto técnico",
      result: "Resultado",
      stack: "Stack",
      data: "Datos",
      security: "Seguridad · OWASP Top 10",
      visit: "Visitar sitio",
      role: "Rol",
      period: "Periodo",
    },
  },
  projects: [
    {
      id: "chakray",
      name: "Chakray Kamayuk",
      tag: "eCommerce · Full-Stack",
      period: "Nov – Dic 2025 · Remoto",
      role: "Full-Stack Developer & UI/UX",
      url: links.chakray,
      images: [
        { src: "/img/chakray/1.webp", alt: "Portada de la tienda Chakray Kamayuk" },
        { src: "/img/chakray/2.webp", alt: "Catálogo de productos de Chakray Kamayuk" },
      ],
      summary:
        "Tienda online de hongos y alimentos orgánicos pensada para el mercado ecuatoriano: descubres productos en la app y cierras la compra por WhatsApp, el canal en el que el cliente ya confía.",
      problem:
        "Comprar alimentos frescos online en Ecuador todavía genera desconfianza. La tienda debía facilitar el descubrimiento de productos y cerrar la venta en un canal cercano y humano.",
      challenge:
        "Gestión de inventario y pedidos, atención al cliente y un sistema de recompra: los clientes obtienen descuentos al publicar sus propias recetas. Además, migré la base de datos de MongoDB a Firebase sin perder información.",
      result:
        "Se consolidó una base de compra y recompra constante que asegura ventas sucesivas.",
      stack: ["React", "Next.js", "Node.js", "Tailwind CSS", "Firebase", "Vercel"],
      data: "Migración MongoDB → Firebase (Firestore + Auth)",
      security: [
        { code: "A01", text: "Control de acceso con reglas de seguridad de Firebase por usuario y rol" },
        { code: "A02", text: "HTTPS en todo el sitio; secretos solo en el servidor, nunca en el frontend" },
        { code: "A03", text: "Validación y saneamiento de entradas; consultas parametrizadas" },
        { code: "A05", text: "Cabeceras de seguridad (CSP, HSTS) y CORS restringido" },
        { code: "A07", text: "Sesiones seguras y límite de intentos de autenticación" },
      ],
    },
    {
      id: "clariplay",
      name: "Clariplay",
      tag: "EdTech · Música · Full-Stack",
      period: "Jun – Jul 2025 · Remoto / Híbrido",
      role: "Full-Stack Developer",
      url: links.clariplay,
      images: [
        { src: "/img/clariplay/6.webp", alt: "Portada de Clariplay" },
        { src: "/img/clariplay/3.webp", alt: "Lección con partitura interactiva, reproducción y grabación" },
        { src: "/img/clariplay/1.webp", alt: "Panel del profesor con cursos y estudiantes" },
        { src: "/img/clariplay/4.webp", alt: "Calificaciones y retroalimentación del estudiante" },
      ],
      summary:
        "Plataforma de seguimiento para estudiantes de música: el profesor asigna lecciones con partituras que el estudiante escucha, toca y graba, como un karaoke con instrumentos.",
      problem:
        "El estudio en casa es difícil de verificar y el estudiante rara vez se escucha a sí mismo. Clariplay asegura la práctica y refuerza la audiopercepción: al oír la partitura y su propia grabación, el estudiante se autoevalúa y mejora por iniciativa propia.",
      challenge:
        "Las APIs de partituras son muy costosas, así que construí un reproductor propio con librerías open source: visualizador de partituras, síntesis de sonido tipo MIDI y lectura de archivos MusicXML exportados desde Finale o Sibelius, para que crear lecciones sea cómodo para los profesores.",
      result:
        "Validado en una experiencia docente en la PUCE con resultados positivos: los estudiantes mejoraron su entonación, lectura musical y afinación al tener una referencia audible.",
      stack: ["React", "CSS", "Firebase", "MusicXML", "Web Audio", "Arquitectura de servicios"],
      data: "Firebase nativo (Auth, Firestore, Storage) desde el diseño",
      security: [
        { code: "A01", text: "Reglas de Firebase por rol: profesor y estudiante solo ven lo que les corresponde" },
        { code: "A02", text: "HTTPS y secretos fuera del cliente" },
        { code: "A03", text: "Validación y saneamiento de entradas y archivos" },
        { code: "A05", text: "Cabeceras de seguridad (CSP, HSTS) y CORS restringido" },
        { code: "A07", text: "Sesiones seguras y límite de intentos" },
      ],
    },
  ] as Project[],
  marcas: {
    label: "03 — IA aplicada",
    badge: "Confidencial · NDA",
    name: "Radar de Marcas",
    title: "Antes de pagar un registro, saber si tu marca va a pasar.",
    hook: "Registrar una marca que luego es rechazada es tiempo y dinero perdidos. Esta herramienta lo previene antes de iniciar el trámite.",
    steps: [
      { t: "Búsqueda", d: "Consulta una base de marcas con registro legal en el SENADI, filtrando por nombre y clase de Niza." },
      { t: "Evaluación con IA", d: "Un modelo de lenguaje, con tareas acotadas, analiza la marca del cliente: similitud fonética, gráfica y conceptual." },
      { t: "Reporte", d: "Entrega las marcas similares, su actividad económica y un dictamen de viabilidad con nivel de riesgo." },
      { t: "Trámite", d: "Con el riesgo identificado, el registro se realiza con muchas menos probabilidades de rechazo." },
    ],
    note: "Herramienta desarrollada bajo acuerdo de confidencialidad. Se muestran capturas autorizadas; el código y los datos no son públicos.",
    stack: ["Python", "Django", "Groq · LLM", "Búsqueda fonética", "Clasificación de Niza", "Firebase"],
    security: [
      { code: "LLM01", text: "IA limitada a tareas específicas para resistir prompt injection" },
      { code: "LLM10", text: "Consumo acotado: límite de tokens y bloqueo ante excesos" },
      { code: "A01", text: "Reglas de seguridad por usuario y rol" },
      { code: "A03", text: "Validación de entradas y consultas parametrizadas" },
      { code: "A05", text: "CSP, HSTS y CORS restringido; claves solo en el servidor" },
    ],
    images: [
      { src: "/img/marcas/2.webp", alt: "Formulario de análisis de riesgo de marca" },
      { src: "/img/marcas/1.webp", alt: "Dictamen de viabilidad con nivel de riesgo" },
    ],
  },
  ar: {
    label: "04 — AR & 3D en la web",
    badge: "Proyecto bajo contrato",
    name: "Macroinvertebrados AR",
    title: "Un ecosistema de río, sobre una hoja de papel.",
    body: "Herramienta pedagógica de realidad aumentada para identificar la calidad del agua según los macroinvertebrados presentes. Mantenerlos vivos en un laboratorio es complejo y costoso; con esta app, cualquier persona con un teléfono puede explorarlos en 3D, ver cómo se mueven y aprender jugando.",
    challenge:
      "A-Frame ofrece componentes de AR cerrados y poco configurables. Los extendí con JavaScript para crear zonas interactivas dentro de la escena 3D: al tocar el modelo se desbloquean fichas con hábitat, tamaño, grupo funcional e indicador de calidad del agua (BMWP). Modelé y optimicé 13 especies con sus animaciones para que corran fluidas sin apps nativas ni sensores especiales.",
    result: "Funciona en la mayoría de teléfonos, incluso de gama baja, directamente en el navegador. Tuvo muy buena recepción en la comunidad de la UNACH.",
    stats: [
      { n: "13", l: "especies modeladas en 3D" },
      { n: "0", l: "apps que instalar" },
      { n: "100%", l: "tecnologías abiertas" },
    ],
    stack: ["WebAR", "A-Frame", "JavaScript", "Modelado 3D", "Optimización de modelos", "Sitio estático"],
    ctaSite: "Abrir la app",
    ctaTarget: "Descargar marcador (PDF)",
    howTo: "Cómo probarla",
    steps: ["Descarga e imprime el marcador (o ábrelo en otra pantalla).", "Abre la app desde tu teléfono.", "Apunta la cámara al marcador y toca los macroinvertebrados."],
    codeNote: "Código bajo contrato: no es público.",
    viewer: {
      title: "Explóralo en 3D",
      species: "Díptera Blephariceridae",
      hint: "Arrastra para girar",
      ar: "Ver en tu espacio (AR)",
      arHint: "En el celular, ponlo sobre tu mesa con la cámara. Sin instalar nada.",
      loading: "Cargando modelo 3D…",
    },
  },
  os: {
    label: "05 — Open Source",
    badge: "Código abierto · Uso no comercial",
    name: "PDF Book Viewer",
    title: "De PDF a libro digital interactivo, gratis.",
    body: "Framework open source para convertir cualquier PDF en un libro digital que se lee en el navegador, con elementos interactivos en cada página: animaciones WebP o GIF, botones de audio e incluso video.",
    challenge:
      "Construirlo todo con tecnologías libres y lograr que agregar interactividad a cada página sea intuitivo. El reto principal fue de UI/UX: que cualquier persona pueda crear su libro sin ser programadora.",
    result: "Publiqué con él «Fábrica de Historias», un libro de 68 páginas que yo mismo maqueté e ilustré, con animaciones, videos y sonidos en cada historia.",
    ctaRepo: "Ver en GitHub",
    ctaLive: "Abrir el libro",
    liveTitle: "Pruébalo aquí mismo",
    liveLoad: "Cargar libro interactivo",
    stack: ["JavaScript", "PDF rendering", "HTML / CSS", "UI/UX", "Netlify"],
  },
  stack: {
    label: "06 — Stack",
    title: "Herramientas para cada capa.",
    groups: [
      { name: "Frontend", items: ["React", "Next.js", "JavaScript", "Tailwind CSS", "GSAP", "HTML / CSS"] },
      { name: "Backend & APIs", items: ["Node.js", "REST APIs", "Python", "Django", "PHP", "Arquitectura de servicios"] },
      { name: "Datos", items: ["NoSQL: Firebase · Firestore", "NoSQL: MongoDB", "SQL: MySQL", "SQL: PostgreSQL", "Migración de bases de datos"] },
      { name: "IA aplicada", items: ["IA agéntica en desarrollo", "Testing de webs y apps con IA", "Creación de herramientas con IA", "Groq · LLMs", "IA con límites y control de consumo"] },
      { name: "3D · AR · Mobile", items: ["WebAR · A-Frame", "Modelado y optimización 3D", "Unity", "React Native", "Ionic"] },
      { name: "Diseño", items: ["Figma", "UI/UX", "Motion graphics", "Ilustración y maquetación"] },
      { name: "Seguridad", items: ["OWASP Top 10", "OWASP LLM Top 10", "Firebase Security Rules", "CSP · HSTS · CORS", "Validación y rate limiting"] },
      { name: "DevOps", items: ["Git · GitHub", "Vercel", "Netlify"] },
    ],
    selfTitle: "Este portafolio también es una prueba",
    self: [
      "Content-Security-Policy con nonce por petición",
      "HSTS, X-Frame-Options, Referrer y Permissions-Policy",
      "Validación de entradas con esquemas (zod)",
      "Rate limiting y anti-spam en el chat y el formulario",
      "Claves de API solo en el servidor",
    ],
  },
  contact: {
    label: "07 — Contacto",
    title: "¿Construimos algo juntos?",
    sub: "Cuéntame tu proyecto. Respondo en menos de 24 horas.",
    name: "Nombre",
    email: "Correo",
    message: "Mensaje",
    send: "Enviar mensaje",
    sending: "Enviando…",
    ok: "¡Gracias! Tu mensaje llegó. Te respondo pronto.",
    error: "No se pudo enviar. Escríbeme directamente a",
    or: "o escríbeme por",
  },
  chat: {
    open: "Pregúntale a mi portafolio",
    title: "Asistente NGi",
    subtitle: "IA · responde sobre mi experiencia",
    placeholder: "Escribe tu pregunta…",
    greeting: "¡Hola! Soy el asistente del portafolio de Carlos. Pregúntame por su experiencia, proyectos o stack.",
    suggestions: ["¿Qué experiencia tiene en backend?", "¿Cómo aplica OWASP?", "¿Está disponible para trabajar?"],
    send: "Enviar",
    error: "No pude responder ahora. Intenta de nuevo en un momento.",
    disclaimer: "Respuestas generadas por IA (Groq). Pueden contener errores.",
    close: "Cerrar chat",
  },
  footer: {
    rights: "Diseñado y desarrollado por Carlos Asadobay · NGi",
    built: "Next.js · GSAP · Groq · Vercel",
    top: "Volver arriba",
  },
};

export type Content = typeof es;

const en: Content = {
  meta: {
    title: "Carlos Asadobay — Full-Stack & Creative Developer",
    description:
      "Portfolio of Carlos Asadobay (NGi): full-stack development, backend, UI/UX, applied AI, WebAR and 3D. Riobamba, Ecuador · Remote.",
  },
  nav: {
    about: "Profile",
    work: "Work",
    ai: "AI",
    ar: "AR / 3D",
    os: "Open Source",
    stack: "Stack",
    contact: "Contact",
    switchTo: "ES",
    switchLabel: "Cambiar a español",
    skip: "Skip to content",
  },
  intro: { skip: "Skip intro" },
  hero: {
    kicker: "Full-Stack & Creative Developer",
    lineA: "I design the experience.",
    lineB: "I build what holds it up.",
    sub: "Web · UI/UX · Backend · Applied AI · WebAR. I bring the creative side together with solid, secure, production-ready code.",
    ctaWork: "See projects",
    ctaCv: "Download CV",
    location: "Riobamba, Ecuador · Remote / Hybrid",
    scroll: "Unfold",
    ring: "FULL-STACK · CREATIVE DEV · BACKEND · UI/UX · APPLIED AI · WEBAR · ",
  },
  about: {
    label: "01 — Profile",
    title: "Two layers, one developer.",
    body: [
      "I'm Carlos Asadobay, a full-stack and creative developer with a Bachelor's in Interactive Media Design from Universidad San Francisco de Quito (2024).",
      "I build web apps, eCommerce and educational platforms with React, Next.js and Node.js. I design the interface in Figma and also the architecture behind it: APIs, SQL and NoSQL databases, OWASP-based security and AI integration.",
      "Agentic AI is part of my daily workflow: to build tools, automate testing of websites and apps, and ship faster without trading off quality.",
    ],
    facts: [
      { k: "Based in", v: "Riobamba, Ecuador" },
      { k: "Work mode", v: "Remote / Hybrid" },
      { k: "Languages", v: "Native Spanish · English B2" },
      { k: "Education", v: "B.A. Interactive Media Design — USFQ" },
    ],
    lensHint: "Hover over the photo",
  },
  work: {
    label: "02 — Work",
    title: "What you see, and what holds it up.",
    intro:
      "Every project has two sides. Peel the corner to reveal the technical layer: architecture, data and the OWASP security measures applied.",
    peelOpen: "See technical layer",
    peelClose: "See visual layer",
    labels: {
      problem: "The problem",
      challenge: "Technical challenge",
      result: "Outcome",
      stack: "Stack",
      data: "Data",
      security: "Security · OWASP Top 10",
      visit: "Visit site",
      role: "Role",
      period: "Period",
    },
  },
  projects: [
    {
      id: "chakray",
      name: "Chakray Kamayuk",
      tag: "eCommerce · Full-Stack",
      period: "Nov – Dec 2025 · Remote",
      role: "Full-Stack Developer & UI/UX",
      url: links.chakray,
      images: [
        { src: "/img/chakray/1.webp", alt: "Chakray Kamayuk store home page" },
        { src: "/img/chakray/2.webp", alt: "Chakray Kamayuk product catalog" },
      ],
      summary:
        "An online store for mushrooms and organic food built for the Ecuadorian market: customers discover products in the app and close the purchase on WhatsApp, the channel they already trust.",
      problem:
        "Buying fresh food online in Ecuador still feels risky to many people. The store had to make product discovery easy and close the sale through a close, human channel.",
      challenge:
        "Inventory and order management, customer service and a repurchase system: customers earn discounts by publishing their own recipes. I also migrated the database from MongoDB to Firebase with no data loss.",
      result: "It built a steady base of purchases and repeat purchases that secures recurring sales.",
      stack: ["React", "Next.js", "Node.js", "Tailwind CSS", "Firebase", "Vercel"],
      data: "MongoDB → Firebase migration (Firestore + Auth)",
      security: [
        { code: "A01", text: "Access control with Firebase security rules per user and role" },
        { code: "A02", text: "HTTPS everywhere; secrets server-side only, never in the frontend" },
        { code: "A03", text: "Input validation and sanitization; parameterized queries" },
        { code: "A05", text: "Security headers (CSP, HSTS) and restricted CORS" },
        { code: "A07", text: "Secure sessions and login attempt limits" },
      ],
    },
    {
      id: "clariplay",
      name: "Clariplay",
      tag: "EdTech · Music · Full-Stack",
      period: "Jun – Jul 2025 · Remote / Hybrid",
      role: "Full-Stack Developer",
      url: links.clariplay,
      images: [
        { src: "/img/clariplay/6.webp", alt: "Clariplay landing page" },
        { src: "/img/clariplay/3.webp", alt: "Lesson with interactive sheet music, playback and recording" },
        { src: "/img/clariplay/1.webp", alt: "Teacher dashboard with courses and students" },
        { src: "/img/clariplay/4.webp", alt: "Student grades and feedback" },
      ],
      summary:
        "A progress-tracking platform for music students: teachers assign lessons with sheet music that students listen to, play along with and record, like karaoke with instruments.",
      problem:
        "Home practice is hard to verify, and students rarely listen to themselves. Clariplay makes sure practice happens and trains ear skills: by hearing the score and their own recording, students self-assess and improve on their own.",
      challenge:
        "Sheet music APIs are expensive, so I built a custom player with open-source libraries: a score renderer, MIDI-style sound synthesis and support for MusicXML files exported from Finale or Sibelius, so creating lessons is easy for teachers.",
      result:
        "Validated in a teaching pilot at PUCE with positive results: students improved their intonation, sight-reading and tuning thanks to an audible reference.",
      stack: ["React", "CSS", "Firebase", "MusicXML", "Web Audio", "Service architecture"],
      data: "Native Firebase (Auth, Firestore, Storage) by design",
      security: [
        { code: "A01", text: "Role-based Firebase rules: teachers and students only see their own data" },
        { code: "A02", text: "HTTPS and secrets kept off the client" },
        { code: "A03", text: "Validation and sanitization of inputs and files" },
        { code: "A05", text: "Security headers (CSP, HSTS) and restricted CORS" },
        { code: "A07", text: "Secure sessions and attempt limits" },
      ],
    },
  ],
  marcas: {
    label: "03 — Applied AI",
    badge: "Confidential · NDA",
    name: "Brand Radar",
    title: "Know if your trademark will pass before paying to register it.",
    hook: "Filing a trademark that later gets rejected is wasted time and money. This tool catches the risk before the process even starts.",
    steps: [
      { t: "Search", d: "Queries a database of trademarks legally registered with SENADI (Ecuador's IP office), filtered by name and Nice class." },
      { t: "AI evaluation", d: "A language model with narrowly scoped tasks analyzes the client's mark: phonetic, visual and conceptual similarity." },
      { t: "Report", d: "Returns similar marks, their economic activity and a viability verdict with a risk level." },
      { t: "Filing", d: "With the risk identified, the registration goes ahead with far lower odds of rejection." },
    ],
    note: "Built under a confidentiality agreement. Authorized screenshots only; code and data are not public.",
    stack: ["Python", "Django", "Groq · LLM", "Phonetic search", "Nice Classification", "Firebase"],
    security: [
      { code: "LLM01", text: "AI restricted to specific tasks to resist prompt injection" },
      { code: "LLM10", text: "Bounded consumption: token limits and blocking on overuse" },
      { code: "A01", text: "Security rules per user and role" },
      { code: "A03", text: "Input validation and parameterized queries" },
      { code: "A05", text: "CSP, HSTS and restricted CORS; keys server-side only" },
    ],
    images: [
      { src: "/img/marcas/2.webp", alt: "Trademark risk analysis form" },
      { src: "/img/marcas/1.webp", alt: "Viability verdict with risk level" },
    ],
  },
  ar: {
    label: "04 — AR & 3D on the web",
    badge: "Client project",
    name: "Macroinvertebrados AR",
    title: "A river ecosystem, on a sheet of paper.",
    body: "An augmented reality teaching tool to assess water quality based on which macroinvertebrates are present. Keeping them alive in a lab is complex and expensive; with this app, anyone with a phone can explore them in 3D, see how they move and learn through play.",
    challenge:
      "A-Frame ships closed, barely configurable AR components. I extended them with JavaScript to create interactive zones inside the 3D scene: tapping the model unlocks cards with habitat, size, functional group and a water-quality indicator (BMWP). I modeled and optimized 13 species with their animations so they run smoothly with no native app and no special sensors.",
    result: "It runs on most phones, even low-end ones, right in the browser, and was very well received by the UNACH community.",
    stats: [
      { n: "13", l: "species modeled in 3D" },
      { n: "0", l: "apps to install" },
      { n: "100%", l: "open technologies" },
    ],
    stack: ["WebAR", "A-Frame", "JavaScript", "3D modeling", "Model optimization", "Static site"],
    ctaSite: "Open the app",
    ctaTarget: "Download marker (PDF)",
    howTo: "How to try it",
    steps: ["Download and print the marker (or open it on another screen).", "Open the app on your phone.", "Point the camera at the marker and tap the macroinvertebrates."],
    codeNote: "Client code under contract: not public.",
    viewer: {
      title: "Explore it in 3D",
      species: "Diptera Blephariceridae",
      hint: "Drag to rotate",
      ar: "View in your space (AR)",
      arHint: "On your phone, place it on your desk with the camera. Nothing to install.",
      loading: "Loading 3D model…",
    },
  },
  os: {
    label: "05 — Open Source",
    badge: "Open source · Non-commercial use",
    name: "PDF Book Viewer",
    title: "From PDF to interactive digital book, for free.",
    body: "An open-source framework that turns any PDF into a digital book you read in the browser, with interactive elements on every page: WebP or GIF animations, audio buttons and even video.",
    challenge:
      "Building everything on free technologies and making it intuitive to add interactivity to each page. The main challenge was UI/UX: anyone should be able to create their book without being a programmer.",
    result: "I used it to publish “Fábrica de Historias”, a 68-page book I laid out and illustrated myself, with animations, videos and sounds in every story.",
    ctaRepo: "View on GitHub",
    ctaLive: "Open the book",
    liveTitle: "Try it right here",
    liveLoad: "Load interactive book",
    stack: ["JavaScript", "PDF rendering", "HTML / CSS", "UI/UX", "Netlify"],
  },
  stack: {
    label: "06 — Stack",
    title: "Tools for every layer.",
    groups: [
      { name: "Frontend", items: ["React", "Next.js", "JavaScript", "Tailwind CSS", "GSAP", "HTML / CSS"] },
      { name: "Backend & APIs", items: ["Node.js", "REST APIs", "Python", "Django", "PHP", "Service architecture"] },
      { name: "Data", items: ["NoSQL: Firebase · Firestore", "NoSQL: MongoDB", "SQL: MySQL", "SQL: PostgreSQL", "Database migration"] },
      { name: "Applied AI", items: ["Agentic AI for development", "AI-driven web & app testing", "Building AI tools", "Groq · LLMs", "AI with guardrails & usage limits"] },
      { name: "3D · AR · Mobile", items: ["WebAR · A-Frame", "3D modeling & optimization", "Unity", "React Native", "Ionic"] },
      { name: "Design", items: ["Figma", "UI/UX", "Motion graphics", "Illustration & layout"] },
      { name: "Security", items: ["OWASP Top 10", "OWASP LLM Top 10", "Firebase Security Rules", "CSP · HSTS · CORS", "Validation & rate limiting"] },
      { name: "DevOps", items: ["Git · GitHub", "Vercel", "Netlify"] },
    ],
    selfTitle: "This portfolio is proof, too",
    self: [
      "Per-request nonce Content-Security-Policy",
      "HSTS, X-Frame-Options, Referrer and Permissions-Policy",
      "Schema-based input validation (zod)",
      "Rate limiting and anti-spam on chat and contact form",
      "API keys server-side only",
    ],
  },
  contact: {
    label: "07 — Contact",
    title: "Shall we build something together?",
    sub: "Tell me about your project. I reply within 24 hours.",
    name: "Name",
    email: "Email",
    message: "Message",
    send: "Send message",
    sending: "Sending…",
    ok: "Thanks! Your message arrived. I'll get back to you soon.",
    error: "Couldn't send it. Write to me directly at",
    or: "or message me on",
  },
  chat: {
    open: "Ask my portfolio",
    title: "NGi Assistant",
    subtitle: "AI · answers about my experience",
    placeholder: "Type your question…",
    greeting: "Hi! I'm the assistant for Carlos's portfolio. Ask me about his experience, projects or stack.",
    suggestions: ["What backend experience does he have?", "How does he apply OWASP?", "Is he available for work?"],
    send: "Send",
    error: "I couldn't answer right now. Please try again in a moment.",
    disclaimer: "AI-generated answers (Groq). They may contain mistakes.",
    close: "Close chat",
  },
  footer: {
    rights: "Designed & built by Carlos Asadobay · NGi",
    built: "Next.js · GSAP · Groq · Vercel",
    top: "Back to top",
  },
};

const content: Record<Locale, Content> = { es, en };
export function getContent(locale: Locale): Content {
  return content[locale];
}

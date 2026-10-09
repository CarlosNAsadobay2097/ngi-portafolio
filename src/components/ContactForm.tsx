"use client";
import { useRef, useState } from "react";
import type { Content } from "@/content/content";
import { links } from "@/content/content";

export default function ContactForm({ t, locale }: { t: Content["contact"]; locale: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const started = useRef(Date.now());

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fd.get("name"),
          email: fd.get("email"),
          message: fd.get("message"),
          website: fd.get("website"), // honeypot
          elapsed: Date.now() - started.current,
          locale,
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("ok");
      form.reset();
    } catch {
      setStatus("error");
    }
  };

  const field =
    "w-full bg-transparent border-b-2 border-white/35 focus:border-white outline-none py-3 text-lg placeholder:text-white/50 transition-colors";

  return (
    <form onSubmit={onSubmit} className="space-y-7" noValidate={false}>
      <div className="grid sm:grid-cols-2 gap-7">
        <label className="block">
          <span className="eyebrow text-white/70">{t.name}</span>
          <input name="name" required minLength={2} maxLength={80} autoComplete="name" className={field} />
        </label>
        <label className="block">
          <span className="eyebrow text-white/70">{t.email}</span>
          <input name="email" type="email" required maxLength={120} autoComplete="email" className={field} />
        </label>
      </div>
      <label className="block">
        <span className="eyebrow text-white/70">{t.message}</span>
        <textarea name="message" required minLength={10} maxLength={2000} rows={4} className={`${field} resize-none`} />
      </label>
      {/* Honeypot anti-spam: invisible para personas */}
      <div aria-hidden className="absolute -left-[9999px] h-0 overflow-hidden">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div className="flex flex-wrap items-center gap-5">
        <button type="submit" disabled={status === "sending"} className="btn bg-white text-red hover:bg-ink hover:text-white disabled:opacity-60" data-cursor="hover">
          {status === "sending" ? t.sending : t.send} <span aria-hidden>→</span>
        </button>
        <p role="status" aria-live="polite" className="text-sm">
          {status === "ok" && t.ok}
          {status === "error" && (
            <>
              {t.error}{" "}
              <a className="underline font-semibold" href={`mailto:${links.email}`}>
                {links.email}
              </a>
            </>
          )}
        </p>
      </div>
    </form>
  );
}

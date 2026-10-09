"use client";
import { useEffect, useRef, useState } from "react";
import Logo from "./Logo";
import type { Content } from "@/content/content";

type Msg = { role: "user" | "assistant"; content: string; error?: boolean };

/** "Pregúntale a mi portafolio": asistente con IA (Groq) vía /api/chat. */
export default function Chat({ t, locale }: { t: Content["chat"]; locale: string }) {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const list = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    list.current?.scrollTo({ top: list.current.scrollHeight, behavior: "smooth" });
  }, [msgs, busy]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const send = async (text: string) => {
    const q = text.trim().slice(0, 500);
    if (!q || busy) return;
    const next = [...msgs, { role: "user" as const, content: q }];
    setMsgs(next);
    setInput("");
    setBusy(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // No reenviamos mensajes de error al modelo; solo la conversación real
        body: JSON.stringify({ messages: next.filter((m) => !m.error).map(({ role, content }) => ({ role, content })).slice(-8), locale }),
      });
      const data = await res.json().catch(() => ({}));
      const ok = res.ok && data.reply;
      setMsgs((m) => [...m, { role: "assistant", content: ok ? data.reply : res.status === 400 ? t.error : data.error ?? t.error, error: !ok }]);
    } catch {
      setMsgs((m) => [...m, { role: "assistant", content: t.error, error: true }]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="ngi-chat"
        className="fixed bottom-5 right-5 z-[70] flex items-center gap-3 rounded-full bg-bone text-ink pl-1.5 pr-5 py-1.5 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.6)] hover:scale-[1.03] transition-transform duration-500"
        data-cursor="hover"
      >
        <span className="size-10 block">
          <Logo flat />
        </span>
        <span className="text-sm font-bold hidden sm:inline">{open ? t.close : t.open}</span>
        <span className="sm:hidden text-sm font-bold">{open ? "×" : "IA"}</span>
      </button>

      <div
        id="ngi-chat"
        role="dialog"
        aria-label={t.title}
        aria-modal="false"
        inert={!open}
        className={`fixed z-[70] bottom-24 right-3 left-3 sm:left-auto sm:right-5 sm:w-[400px] h-[min(560px,calc(100svh-140px))] rounded-[28px] bg-ink-2 border border-white/10 text-bone flex flex-col overflow-hidden shadow-[0_40px_100px_-30px_rgba(0,0,0,0.9)] origin-bottom-right transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${
          open ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 translate-y-6 pointer-events-none"
        }`}
        data-lenis-prevent
      >
        <header className="flex items-center gap-3 px-5 py-4 border-b border-white/10 bg-red text-white">
          <span className="size-9 block rounded-full bg-white/15 p-0.5">
            <Logo flat />
          </span>
          <div className="flex-1">
            <p className="font-bold leading-tight">{t.title}</p>
            <p className="text-xs text-white/75">{t.subtitle}</p>
          </div>
          <button onClick={() => setOpen(false)} aria-label={t.close} className="size-8 grid place-items-center rounded-full hover:bg-white/15">
            ×
          </button>
        </header>

        <div ref={list} className="flex-1 overflow-y-auto px-4 py-5 space-y-3" aria-live="polite">
          <Bubble role="assistant" content={t.greeting} />
          {msgs.map((m, i) => (
            <Bubble key={i} {...m} />
          ))}
          {busy && (
            <div className="flex gap-1 px-4 py-3 w-fit rounded-2xl bg-ink-3">
              {[0, 1, 2].map((i) => (
                <span key={i} className="size-1.5 rounded-full bg-red animate-bounce" style={{ animationDelay: `${i * 0.12}s` }} />
              ))}
            </div>
          )}
          {msgs.length === 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {t.suggestions.map((s) => (
                <button key={s} onClick={() => send(s)} className="text-left text-xs rounded-full border border-white/15 px-3 py-2 hover:border-red hover:text-white text-bone/75 transition-colors">
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="p-3 border-t border-white/10"
        >
          <div className="flex items-center gap-2 rounded-full bg-ink px-2 py-1.5 border border-white/10 focus-within:border-red/70">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.placeholder}
              maxLength={500}
              className="flex-1 bg-transparent px-3 py-1.5 text-sm outline-none placeholder:text-bone/40"
              aria-label={t.placeholder}
            />
            <button type="submit" disabled={busy || !input.trim()} className="size-9 rounded-full bg-red text-white grid place-items-center disabled:opacity-40" aria-label={t.send}>
              ↑
            </button>
          </div>
          <p className="text-[0.65rem] text-bone/40 text-center mt-2">{t.disclaimer}</p>
        </form>
      </div>
    </>
  );
}

function Bubble({ role, content }: Pick<Msg, "role" | "content">) {
  const mine = role === "user";
  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <p
        className={`max-w-[85%] whitespace-pre-wrap text-sm leading-relaxed px-4 py-2.5 rounded-2xl ${
          mine ? "bg-red text-white rounded-br-md" : "bg-ink-3 text-bone/90 rounded-bl-md"
        }`}
      >
        {content}
      </p>
    </div>
  );
}

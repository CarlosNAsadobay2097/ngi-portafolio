"use client";
import { useState } from "react";
import Image from "next/image";

/** Vista previa en vivo: carga el iframe solo cuando el visitante lo pide. */
export default function LiveEmbed({ src, poster, title, loadLabel }: { src: string; poster: string; title: string; loadLabel: string }) {
  const [on, setOn] = useState(false);
  return (
    <div className="rounded-[22px] overflow-hidden border border-ink/10 bg-ink shadow-[0_40px_100px_-50px_rgba(0,0,0,0.6)]">
      <div className="flex items-center gap-1.5 px-4 h-10 bg-ink-2 text-bone/50">
        <span className="size-2.5 rounded-full bg-red" />
        <span className="size-2.5 rounded-full bg-white/20" />
        <span className="size-2.5 rounded-full bg-white/20" />
        <span className="ml-3 font-mono text-[0.7rem] truncate">{src.replace("https://", "")}</span>
      </div>
      <div className="relative aspect-[16/10] bg-ink">
        {on ? (
          <iframe
            src={src}
            title={title}
            className="absolute inset-0 size-full"
            loading="lazy"
            sandbox="allow-scripts allow-same-origin allow-popups allow-downloads"
            referrerPolicy="no-referrer"
            allow="autoplay; fullscreen"
          />
        ) : (
          <button onClick={() => setOn(true)} className="group absolute inset-0 block" data-cursor="hover">
            <Image src={poster} alt="" fill sizes="(min-width:1024px) 700px, 100vw" className="object-cover opacity-70 group-hover:opacity-50 group-hover:scale-[1.03] transition-all duration-700" />
            <span className="absolute inset-0 grid place-items-center">
              <span className="btn btn-red shadow-2xl">▶ {loadLabel}</span>
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

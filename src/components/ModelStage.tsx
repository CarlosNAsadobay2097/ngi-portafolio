"use client";
import { useEffect, useRef, useState } from "react";
import type { Content } from "@/content/content";

declare module "react" {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & Record<string, unknown>;
    }
  }
}

type MV = HTMLElement & { canActivateAR?: boolean };

/**
 * Visor 3D del macroinvertebrado (model-viewer de Google):
 * gira solo, se puede rotar con el dedo/mouse y en el celular abre la AR nativa
 * (Scene Viewer en Android, Quick Look en iPhone, WebXR).
 * El script se carga solo cuando la sección entra en pantalla.
 */
export default function ModelStage({ t, src }: { t: Content["ar"]["viewer"]; src: string }) {
  const box = useRef<HTMLDivElement>(null);
  const mv = useRef<MV>(null);
  const [ready, setReady] = useState(false); // librería cargada
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [canAR, setCanAR] = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          import("@google/model-viewer").then(() => setReady(true));
        }
      },
      { rootMargin: "400px" },
    );
    if (box.current) io.observe(box.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = mv.current;
    if (!ready || !el) return;
    const onProgress = (e: Event) => setProgress((e as CustomEvent<{ totalProgress: number }>).detail.totalProgress);
    const onLoad = () => {
      setLoaded(true);
      setCanAR(Boolean(el.canActivateAR));
    };
    el.addEventListener("progress", onProgress);
    el.addEventListener("load", onLoad);
    return () => {
      el.removeEventListener("progress", onProgress);
      el.removeEventListener("load", onLoad);
    };
  }, [ready]);

  return (
    <div
      ref={box}
      className="relative aspect-square w-full rounded-[32px] overflow-hidden border border-white/10"
      style={{ background: "radial-gradient(circle at 50% 58%, rgba(223,6,30,0.38) 0%, rgba(223,6,30,0.08) 38%, #121010 70%)" }}
    >
      {/* rejilla sutil tipo "mesa de laboratorio" */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.07]"
        style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "40px 40px", maskImage: "radial-gradient(circle at 50% 60%, #000 20%, transparent 70%)" }}
      />

      {ready && (
        <model-viewer
          ref={mv}
          src={src}
          alt={t.species}
          camera-controls=""
          auto-rotate=""
          auto-rotate-delay="0"
          rotation-per-second="18deg"
          autoplay=""
          animation-name="Armature.008Action"
          camera-orbit="180deg 58deg 105%"
          min-camera-orbit="auto 15deg auto"
          max-camera-orbit="auto 88deg auto"
          disable-zoom=""
          touch-action="pan-y"
          interaction-prompt="none"
          shadow-intensity="1.1"
          shadow-softness="0.9"
          exposure="1.15"
          environment-image="neutral"
          ar=""
          ar-modes="webxr scene-viewer quick-look"
          ar-scale="auto"
          ar-placement="floor"
          loading="eager"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", background: "transparent", "--poster-color": "transparent" } as React.CSSProperties}
        >
          <button
            slot="ar-button"
            className="absolute bottom-5 left-1/2 -translate-x-1/2 btn btn-red shadow-2xl whitespace-nowrap"
          >
            ◎ {t.ar}
          </button>
        </model-viewer>
      )}

      {/* cabecera */}
      <div className="absolute top-5 left-5 right-5 flex items-start justify-between gap-3 pointer-events-none">
        <div>
          <p className="eyebrow text-red">{t.title}</p>
          <p className="font-mono text-xs text-bone/60 mt-1 italic">{t.species}</p>
        </div>
        <span className="chip text-bone/60 !text-[0.65rem]">3D · GLB</span>
      </div>

      {/* carga */}
      {!loaded && (
        <div className="absolute inset-0 grid place-items-center pointer-events-none">
          <div className="w-40 text-center">
            <p className="eyebrow text-bone/60 mb-3">{t.loading}</p>
            <div className="h-0.5 bg-white/10 rounded overflow-hidden">
              <div className="h-full bg-red transition-[width] duration-300" style={{ width: `${Math.round(progress * 100)}%` }} />
            </div>
          </div>
        </div>
      )}

      {/* pie */}
      {loaded && !canAR && (
        <div className="absolute bottom-5 left-5 right-5 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
          <span className="chip text-bone/70">↻ {t.hint}</span>
          <span className="text-xs text-bone/50 max-w-[30ch] text-right">{t.arHint}</span>
        </div>
      )}
    </div>
  );
}

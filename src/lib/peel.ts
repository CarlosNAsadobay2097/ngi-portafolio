/**
 * Geometría del "pliegue" (homenaje a la esquina doblada del logo NGi).
 * Se despega la esquina inferior derecha de un rectángulo W×H.
 * p = cuánto avanza el pliegue sobre la diagonal (0 … W+H).
 */
type Pt = [number, number];

function clipHalfPlane(poly: Pt[], c: number, keepBelow: boolean): Pt[] {
  const inside = (p: Pt) => (keepBelow ? p[0] + p[1] <= c : p[0] + p[1] >= c);
  const out: Pt[] = [];
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i];
    const b = poly[(i + 1) % poly.length];
    const ia = inside(a);
    const ib = inside(b);
    if (ia) out.push(a);
    if (ia !== ib) {
      const sa = a[0] + a[1] - c;
      const sb = b[0] + b[1] - c;
      const t = sa / (sa - sb);
      out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
    }
  }
  return out;
}

export function peelGeometry(W: number, H: number, p: number) {
  const c = W + H - p;
  const rect: Pt[] = [
    [0, 0],
    [W, 0],
    [W, H],
    [0, H],
  ];
  const kept = clipHalfPlane(rect, c, true);
  const removed = clipHalfPlane(rect, c, false);
  const flap = removed.map(([x, y]) => [c - y, c - x] as Pt);
  return { kept, flap, c };
}

export function toClipPath(poly: Pt[]) {
  if (poly.length < 3) return "polygon(0 0, 0 0, 0 0)";
  return `polygon(${poly.map(([x, y]) => `${x.toFixed(1)}px ${y.toFixed(1)}px`).join(", ")})`;
}

export function toPoints(poly: Pt[]) {
  return poly.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
}

/** Aplica el pliegue a un elemento (clip) y a un <polygon> SVG (solapa). */
export function applyPeel(target: HTMLElement, flap: SVGPolygonElement | null, p: number) {
  const W = target.offsetWidth;
  const H = target.offsetHeight;
  if (p <= 0.5) {
    target.style.clipPath = "";
    flap?.setAttribute("points", "");
    return;
  }
  const { kept, flap: f } = peelGeometry(W, H, p);
  target.style.clipPath = toClipPath(kept);
  if (flap) {
    flap.setAttribute("points", toPoints(f));
    // La solapa se desvanece al final para no invadir el resto de la página
    const total = W + H;
    const o = Math.max(0, Math.min(1, 1 - (p - total * 0.5) / (total * 0.35)));
    flap.style.opacity = String(o);
  }
}

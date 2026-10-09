import { forwardRef, useId } from "react";

/** Solapa SVG del pliegue: el reverso del papel, como en el logo. */
const PeelFlap = forwardRef<SVGPolygonElement, { className?: string; tone?: "light" | "red" }>(function PeelFlap(
  { className, tone = "light" },
  ref,
) {
  const id = useId().replace(/:/g, "");
  const stops =
    tone === "red"
      ? ["#ffffff", "#f3eee8", "#8f8a85"]
      : ["#ffffff", "#ece7df", "#9d968d"];
  return (
    <svg
      aria-hidden
      className={className}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible", pointerEvents: "none", filter: "drop-shadow(-10px -10px 18px rgb(0 0 0 / 0.28))" }}
    >
      <defs>
        <linearGradient id={`flap-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={stops[0]} />
          <stop offset="0.55" stopColor={stops[1]} />
          <stop offset="1" stopColor={stops[2]} />
        </linearGradient>
      </defs>
      <polygon ref={ref} points="" fill={`url(#flap-${id})`} />
    </svg>
  );
});

export default PeelFlap;

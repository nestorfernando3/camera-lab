export function NoiseOverlay({ strength }: { strength: number }) {
  if (strength <= 0.01) return null;
  // Visual noise is CSS overlay driven by strength; deterministic seeded pattern is CSS-based
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        opacity: strength * 0.35,
        backgroundImage:
          "repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0px, transparent 1px, transparent 2px, rgba(255,255,255,0.03) 3px)",
        mixBlendMode: "overlay",
      }}
    />
  );
}

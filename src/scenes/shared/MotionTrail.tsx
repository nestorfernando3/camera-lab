export function MotionTrail({ lengthPx, direction }: { lengthPx: number; direction: [number, number] }) {
  const clamped = Math.min(80, Math.max(0, lengthPx * 0.4));
  if (clamped < 1) return null;
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        left: "45%",
        top: "42%",
        width: `${clamped}px`,
        height: "6px",
        background: "rgba(255,255,255,0.25)",
        transform: `translateX(${-clamped / 2}px) rotate(${Math.atan2(direction[1], direction[0])}rad)`,
        filter: "blur(2px)",
        pointerEvents: "none",
      }}
    />
  );
}

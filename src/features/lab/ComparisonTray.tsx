import type { CaptureAttempt } from "./labStore";

export function ComparisonTray({ captures, maxVisible }: { captures: CaptureAttempt[]; maxVisible: number }) {
  const visible = captures.slice(-maxVisible);

  if (maxVisible === 1) {
    const last = visible[0];
    return (
      <div style={{ marginTop: "12px" }} data-testid="comparison-tray" data-mode="single">
        {last ? (
          <div style={{ padding: "8px", border: "1px solid var(--border)", fontSize: "12px" }}>
            <div>Captura {last.id.slice(0, 6)} — f/{last.settings.aperture} 1/{last.settings.shutterDenominator} ISO{last.settings.iso}</div>
            <div style={{ color: "var(--muted)" }}>Exp Δ {last.metrics.exposureDeltaAbs.toFixed(2)} · blur {last.metrics.motionBlurPx.toFixed(1)}px</div>
          </div>
        ) : (
          <div style={{ fontSize: "12px", color: "var(--muted)" }}>Sin capturas aún</div>
        )}
      </div>
    );
  }

  if (maxVisible === 2) {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "12px" }} data-testid="comparison-tray" data-mode="ab">
        {visible.length === 0 && <div style={{ fontSize: "12px", color: "var(--muted)" }}>Toma dos capturas para comparar</div>}
        {visible.map((c, idx) => (
          <div key={c.id} style={{ padding: "8px", border: "1px solid var(--border)", fontSize: "12px" }} data-testid={`compare-slot-${idx}`}>
            <div style={{ fontWeight: 600 }}>{idx === 0 ? "A" : "B"} — {c.id.slice(0, 5)}</div>
            <div>f/{c.settings.aperture} 1/{c.settings.shutterDenominator} ISO{c.settings.iso} {c.settings.focalLengthMm}mm</div>
            <div style={{ color: "var(--muted)" }}>{c.metrics.motionBlurPx.toFixed(1)}px mov · {c.metrics.backgroundBlurPx.toFixed(1)}px fondo</div>
            {visible.length === 2 && idx === 1 && (
              <div style={{ marginTop: "4px", fontSize: "11px", color: "var(--accent)" }}>
                Δ mov {(Math.abs(visible[1].metrics.motionBlurPx - visible[0].metrics.motionBlurPx)).toFixed(1)}px
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(maxVisible, 3)}, 1fr)`, gap: "8px", marginTop: "12px" }} data-testid="comparison-tray" data-mode={`up-to-${maxVisible}`}>
      {visible.length === 0 && <div style={{ fontSize: "12px", color: "var(--muted)" }}>Capturas aparecerán aquí</div>}
      {visible.map((c) => (
        <div key={c.id} style={{ padding: "8px", border: "1px solid var(--border)", fontSize: "11px" }} data-testid="compare-card">
          <div>{c.id.slice(0, 5)}</div>
          <div>
            f/{c.settings.aperture} 1/{c.settings.shutterDenominator} ISO{c.settings.iso}
          </div>
          <div style={{ color: "var(--muted)" }}>expΔ {c.metrics.exposureDeltaAbs.toFixed(2)} · noise {c.metrics.noiseStrength.toFixed(2)}</div>
        </div>
      ))}
      <div style={{ fontSize: "11px", color: "var(--muted)", alignSelf: "center" }}>
        {visible.length}/{maxVisible} visibles
      </div>
    </div>
  );
}

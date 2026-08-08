import type { CaptureAttempt } from "./labStore";
export function ComparisonTray({ captures, maxVisible }: { captures: CaptureAttempt[]; maxVisible: number }) {
  const visible = captures.slice(-maxVisible);
  if (maxVisible === 1) {
    const last = visible[0];
    return (
      <div className="panel" data-testid="comparison-tray" data-mode="single">
        <h4 style={{ margin: "0 0 8px" }}>Captura</h4>
        {last ? (
          <div className="compare__card">
            <div style={{ display: "flex", justifyContent: "space-between" }}><strong>{last.id.slice(0, 6)}</strong><span className="mono muted">f/{last.settings.aperture} 1/{last.settings.shutterDenominator} ISO{last.settings.iso}</span></div>
            <div className="mono muted" style={{ marginTop: 6 }}>Δ {last.metrics.exposureDeltaAbs.toFixed(2)} pasos · mov {last.metrics.motionBlurPx.toFixed(1)}px · fondo {last.metrics.backgroundBlurPx.toFixed(1)}px</div>
          </div>
        ) : <div className="mono muted">Sin capturas aún — ajusta y captura.</div>}
      </div>
    );
  }
  if (maxVisible === 2) {
    return (
      <div className="panel" data-testid="comparison-tray" data-mode="ab">
        <h4 style={{ margin: "0 0 8px" }}>Comparación A/B</h4>
        {visible.length === 0 ? <div className="mono muted">Toma dos capturas para comparar</div> : (
          <div className="compare compare--ab">
            {visible.map((c, idx) => (
              <div key={c.id} className="compare__card" data-testid={`compare-slot-${idx}`}>
                <div style={{ display: "flex", justifyContent: "space-between" }}><strong>{idx === 0 ? "A" : "B"}</strong><span className="mono muted">{c.id.slice(0, 5)}</span></div>
                <div className="mono" style={{ marginTop: 4 }}>f/{c.settings.aperture} 1/{c.settings.shutterDenominator} ISO{c.settings.iso} {c.settings.focalLengthMm}mm</div>
                <div className="mono muted">{c.metrics.motionBlurPx.toFixed(1)}px mov · {c.metrics.backgroundBlurPx.toFixed(1)}px fondo</div>
                {visible.length === 2 && idx === 1 && <div className="mono" style={{ marginTop: 6, color: "var(--accent)", fontWeight: 700 }}>Δ mov {(Math.abs(visible[1].metrics.motionBlurPx - visible[0].metrics.motionBlurPx)).toFixed(1)}px</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
  return (
    <div className="panel" data-testid="comparison-tray" data-mode={`up-to-${maxVisible}`}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <h4 style={{ margin: 0 }}>Bandeja</h4><span className="pill">{visible.length}/{maxVisible}</span>
      </div>
      <div className="compare" style={{ gridTemplateColumns: `repeat(${Math.min(maxVisible, 3)}, 1fr)` } as never}>
        {visible.length === 0 ? <div className="mono muted">Capturas aparecerán aquí</div> : visible.map((c) => (
          <div key={c.id} className="compare__card" data-testid="compare-card">
            <div className="mono muted">{c.id.slice(0, 5)}</div>
            <div className="mono">f/{c.settings.aperture} 1/{c.settings.shutterDenominator}</div>
            <div className="mono muted">expΔ {c.metrics.exposureDeltaAbs.toFixed(2)} · ruido {c.metrics.noiseStrength.toFixed(2)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

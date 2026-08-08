import type { CaptureAttempt } from "../lab/labStore";

export function ModuleSummary({ captures, moduleId }: { captures: CaptureAttempt[]; moduleId: string }) {
  if (captures.length < 2) {
    return (
      <div style={{ padding: "12px", border: "1px solid var(--border)" }}>
        <h3>Resumen {moduleId}</h3>
        <p style={{ fontSize: "12px", color: "var(--muted)" }}>Necesitas al menos dos capturas para evidencia.</p>
      </div>
    );
  }
  const first = captures[0];
  const last = captures[captures.length - 1];
  const deltaMotion = first.metrics.motionBlurPx - last.metrics.motionBlurPx;
  const deltaBlur = last.metrics.backgroundBlurPx - first.metrics.backgroundBlurPx;

  return (
    <div style={{ padding: "12px", border: "1px solid var(--border)" }} data-testid="module-summary">
      <h3>Resumen — {moduleId}</h3>
      <p style={{ fontSize: "12px" }}>
        {deltaMotion > 0
          ? `Reduciste el desenfoque de movimiento de ${first.metrics.motionBlurPx.toFixed(1)}px a ${last.metrics.motionBlurPx.toFixed(1)}px entre tu primera y última captura.`
          : `Tu desenfoque de movimiento cambió de ${first.metrics.motionBlurPx.toFixed(1)}px a ${last.metrics.motionBlurPx.toFixed(1)}px.`}
      </p>
      <p style={{ fontSize: "12px", color: "var(--muted)" }}>
        Fondo: {first.metrics.backgroundBlurPx.toFixed(1)}px → {last.metrics.backgroundBlurPx.toFixed(1)}px ({deltaBlur > 0 ? "más borroso" : "más nítido"}).
        Ruido: {last.metrics.noiseStrength.toFixed(2)}.
      </p>
    </div>
  );
}

import type { CaptureAttempt } from "./labStore";
import type { MissionDefinition } from "../../domain/learning/types";
import { evaluateMission } from "../../domain/learning/evaluateMission";

export function FeedbackPanel({ mission, captures }: { mission: MissionDefinition; captures: CaptureAttempt[] }) {
  if (captures.length === 0) return null;
  const result = evaluateMission({ mission, captures });
  const last = captures[captures.length - 1];

  return (
    <div
      style={{
        padding: "10px",
        border: result.passed ? "1px solid #4caf50" : "1px solid var(--border)",
        background: "var(--panel)",
      }}
      data-testid="feedback-panel"
      data-passed={String(result.passed)}
    >
      <h4 style={{ margin: "0 0 8px" }}>{result.passed ? "¡Logrado!" : "Sigue explorando"}</h4>

      <div style={{ fontSize: "12px" }}>
        <strong>Conseguiste / Achieved</strong>
        <ul style={{ margin: "4px 0", paddingLeft: "16px" }}>
          {result.strengths.length ? result.strengths.map((s) => <li key={s}>{s}</li>) : <li>{result.passed ? "Criterios cumplidos" : "Aún no"}</li>}
          <li>Última exposición Δ {last.metrics.exposureDeltaAbs.toFixed(2)} pasos</li>
          <li>Desenfoque movimiento {last.metrics.motionBlurPx.toFixed(1)}px</li>
        </ul>

        <strong>Observa / Notice</strong>
        <ul style={{ margin: "4px 0", paddingLeft: "16px" }}>
          <li>Fondo desenfoque {last.metrics.backgroundBlurPx.toFixed(1)}px — {last.metrics.backgroundBlurPx > 5 ? "fondo muy desenfocado" : last.metrics.backgroundBlurPx < 2 ? "fondo nítido" : "fondo medio"}</li>
          <li>Ruido {last.metrics.noiseStrength.toFixed(2)} — {last.metrics.noiseStrength > 0.6 ? "ruido alto" : "ruido bajo"}</li>
          <li>Movimiento {last.metrics.motionBlurPx > 6 ? "movimiento alto" : "movimiento bajo"}</li>
        </ul>

        <strong>Compromiso / Trade-off</strong>
        <ul style={{ margin: "4px 0", paddingLeft: "16px" }}>
          {result.tradeOffs.length ? result.tradeOffs.map((t) => <li key={t}>{t}</li>) : <li>Equilibrio entre luz, movimiento y nitidez.</li>}
        </ul>
      </div>

      {!result.passed && (
        <div style={{ marginTop: "8px", fontSize: "11px", color: "var(--muted)" }}>
          No hay calificación numérica — ajusta y captura de nuevo. La exposición quedó {last.metrics.exposureDeltaAbs.toFixed(1)} pasos de la referencia.
        </div>
      )}
    </div>
  );
}

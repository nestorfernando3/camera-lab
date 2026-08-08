import type { CaptureAttempt } from "./labStore";
import type { MissionDefinition } from "../../domain/learning/types";
import { evaluateMission } from "../../domain/learning/evaluateMission";
export function FeedbackPanel({ mission, captures }: { mission: MissionDefinition; captures: CaptureAttempt[] }) {
  if (captures.length===0) return null;
  const result = evaluateMission({ mission, captures });
  const last = captures[captures.length-1];
  return (
    <div className={`feedback ${result.passed ? "feedback--pass" : ""}`} data-testid="feedback-panel" data-passed={String(result.passed)}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h4 style={{ margin: 0 }}>{result.passed ? "✓ Logrado" : "Sigue explorando"}</h4>
        <span className="pill" style={{ background: result.passed ? "var(--success)" : "var(--panel-2)", color: result.passed ? "white" : "var(--muted)", borderColor: result.passed ? "var(--success)" : "var(--border)" }}>{result.passed ? "criterios OK" : "ajusta"}</span>
      </div>
      <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
        <div>
          <div className="mono" style={{ fontWeight: 700, fontSize: 11, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--muted)" }}>Conseguiste / Achieved</div>
          <ul className="muted" style={{ margin: "6px 0 0", paddingLeft: 16, fontSize: 12 }}>
            {result.strengths.length ? result.strengths.map(s=><li key={s}>{s}</li>) : <li>{result.passed ? "Criterios cumplidos" : "Aún no"}</li>}
            <li>Exposición Δ {last.metrics.exposureDeltaAbs.toFixed(2)} pasos</li>
            <li>Movimiento {last.metrics.motionBlurPx.toFixed(1)}px {last.metrics.motionBlurPx>6 ? "· alto" : "· bajo"}</li>
          </ul>
        </div>
        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 10 }}>
          <div className="mono" style={{ fontWeight: 700, fontSize: 11, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--muted)" }}>Observa / Notice</div>
          <ul className="muted" style={{ margin: "6px 0 0", paddingLeft: 16, fontSize: 12 }}>
            <li>Fondo {last.metrics.backgroundBlurPx.toFixed(1)}px — {last.metrics.backgroundBlurPx>5 ? "muy desenfocado" : last.metrics.backgroundBlurPx<2 ? "nítido" : "medio"}</li>
            <li>Ruido {last.metrics.noiseStrength.toFixed(2)} — {last.metrics.noiseStrength>0.6 ? "alto" : "bajo"}</li>
          </ul>
        </div>
        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 10 }}>
          <div className="mono" style={{ fontWeight: 700, fontSize: 11, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--muted)" }}>Compromiso / Trade-off</div>
          <ul className="muted" style={{ margin: "6px 0 0", paddingLeft: 16, fontSize: 12 }}>
            {result.tradeOffs.length ? result.tradeOffs.map(t=><li key={t}>{t}</li>) : <li>Equilibrio luz · movimiento · nitidez</li>}
          </ul>
        </div>
      </div>
      {!result.passed && <div className="mono muted" style={{ marginTop: 10, fontSize: 11, background: "var(--bg-soft)", padding: 8, borderRadius: 8 }}>La exposición quedó {last.metrics.exposureDeltaAbs.toFixed(1)} pasos de la referencia — sin nota numérica, solo ajusta y captura.</div>}
    </div>
  );
}

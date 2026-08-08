import { useEffect, useMemo } from "react";
import { useLabStore } from "./labStore";
import { MISSIONS } from "../../content/missions";
import { SceneCanvas } from "../../scenes/SceneCanvas";
import { CameraControls } from "./CameraControls";
import { CaptureButton } from "./CaptureButton";
import { MissionPanel } from "./MissionPanel";
import { useProgressStore } from "../progress/progressStore";
import { evaluateMission } from "../../domain/learning/evaluateMission";

export function LabScreen({ missionId }: { missionId: string }) {
  const { setMission, settings, phase, captures } = useLabStore();
  const reducedMotion = useProgressStore((s) => s.reducedMotion);
  const mission = MISSIONS.find((m) => m.id === missionId);
  useEffect(() => { setMission(missionId); }, [missionId, setMission]);
  if (!mission) return <div style={{ paddingTop: 80 }} className="container">Misión no encontrada</div>;

  const evaluation = useMemo(() => {
    if (captures.length === 0) return null;
    const visible = captures.slice(-mission.maxVisibleCaptures);
    return evaluateMission({ mission, captures: visible });
  }, [captures, mission]);

  const last = captures[captures.length - 1];
  const attempts = captures.length;

  // Pedagogical progressive feedback: first failure -> conceptual, second -> control, third -> direction
  const hintForAttempt = () => {
    if (!last) return null;
    if (evaluation?.passed) return null;
    if (attempts === 1) return "👀 Observa el rastro largo en la pista — el obturador estuvo abierto mucho tiempo y el corredor se movió mientras grababa.";
    if (attempts === 2) return "💡 La obturación controla cuánto tiempo se registra el movimiento. Prueba un tiempo más corto (denominador más grande).";
    return "🎯 Prueba 1/500 o 1/1000 y compara el rastro — cada paso a la derecha es la mitad de tiempo.";
  };

  return (
    <div style={{ paddingTop: 64 }}>
      <div style={{ width: "min(1120px, 96vw)", margin: "0 auto", padding: 16, display: "grid", gridTemplateColumns: "1.45fr 0.75fr", gap: 16 }}>
        <div>
          <div style={{ borderRadius: 14, overflow: "hidden", border: "1px solid var(--glass-border-subtle)", background: "var(--color-bg-secondary)", position: "relative" }}>
            <SceneCanvas sceneId={mission.sceneId} settings={settings} sceneEv100={mission.sceneEv100} reducedMotion={reducedMotion} />
            {!reducedMotion && last && last.metrics.motionBlurPx > 4 && (
              <div style={{ position: "absolute", left: 12, top: 12, background: "rgba(0,0,0,0.55)", color: "#fff", padding: "6px 10px", borderRadius: 999, fontSize: 11, backdropFilter: "blur(6px)" }}>
                Rastro: {last.metrics.motionBlurPx.toFixed(1)}px — {last.metrics.motionBlurPx > 20 ? "muy largo" : "largo"}
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 12, flexWrap: "wrap" }}>
            <CaptureButton />
            <span className="mono muted" data-testid="capture-count">Intento {attempts} {attempts===0?"· aún no capturas":attempts===1?"· primera predicción":`· ${attempts} pruebas`}</span>
            <span className="pill" data-testid="mission-phase">{phase}</span>
            {evaluation?.passed && <span style={{ background: "var(--accent-green)", color: "#fff", padding: "4px 10px", borderRadius: 999, fontSize: 12, fontWeight: 700 }}>✓ Conseguido</span>}
          </div>

          {/* Pedagogical feedback - always visible after action, clear */}
          {attempts === 0 ? (
            <div className="panel" style={{ marginTop: 12, borderStyle: "dashed" }}>
              <div className="section-label"><span className="icon">🎯</span> Tu objetivo</div>
              <p style={{ fontSize: 14, margin: "0 0 6px", fontWeight: 600 }}>Congela al corredor — rastro ≤ 4px</p>
              <p className="muted" style={{ fontSize: 13, margin: 0 }}>Fíjate en la pista. El corredor se mueve a 4 m/s. Elige una obturación, captura y observa el rastro. No hay nota — solo aprendes qué hace cada control.</p>
              <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
                <span className="mono" style={{ background: "var(--color-bg-tertiary)", padding: "4px 8px", borderRadius: 6, fontSize: 11 }}>1/30 = 33ms abierto</span>
                <span className="mono" style={{ background: "var(--color-bg-tertiary)", padding: "4px 8px", borderRadius: 6, fontSize: 11 }}>1/1000 = 1ms</span>
              </div>
            </div>
          ) : evaluation?.passed ? (
            <div className="panel" style={{ marginTop: 12, borderColor: "rgba(52,208,88,0.35)", background: "rgba(52,208,88,0.08)" }} data-testid="feedback-panel" data-passed="true">
              <div className="section-label"><span className="icon">✅</span> Conseguiste / Achieved</div>
              <p style={{ fontSize: 14, fontWeight: 700, color: "var(--accent-green)", margin: 0 }}>Rastro {last.metrics.motionBlurPx.toFixed(1)}px — congelado ✓</p>
              <div style={{ marginTop: 10, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 10 }}>
                <div className="section-label"><span className="icon">👁️</span> Observa / Notice</div>
                <p className="muted" style={{ fontSize: 13, margin: 0 }}>Con 1/{last.settings.shutterDenominator} el sensor solo vio { (1000/last.settings.shutterDenominator).toFixed(1)}ms de movimiento — por eso no hay estela.</p>
              </div>
              <div style={{ marginTop: 10, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 10 }}>
                <div className="section-label"><span className="icon">⚖️</span> Compromiso / Trade-off</div>
                <p className="muted" style={{ fontSize: 12, margin: 0 }}>En esta misión la exposición está compensada para que solo veas movimiento. Más adelante congelar costará luz.</p>
              </div>
            </div>
          ) : (
            <div className="panel" style={{ marginTop: 12 }} data-testid="feedback-panel" data-passed="false">
              <div className="section-label"><span className="icon">👁️</span> Observa / Notice</div>
              <p style={{ fontSize: 14, margin: 0 }}><strong>Aún movido — {last.metrics.motionBlurPx.toFixed(1)}px</strong> (necesitas ≤ 4px)</p>
              <p className="muted" style={{ fontSize: 13, margin: "6px 0 0" }}>{hintForAttempt()}</p>
              <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
                <span className="mono" style={{ background: "var(--color-bg-tertiary)", padding: "4px 8px", borderRadius: 6, fontSize: 11 }}>Tu 1/{last.settings.shutterDenominator} → {last.metrics.motionBlurPx.toFixed(1)}px</span>
                <span className="mono" style={{ background: "rgba(196,30,58,0.12)", padding: "4px 8px", borderRadius: 6, fontSize: 11, border: "1px solid var(--upca-red)" }}>Objetivo ≤4px</span>
              </div>
            </div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div className="panel">
            <MissionPanel mission={mission} phase={phase} />
          </div>
          <CameraControls mission={mission} />
          <details className="panel" style={{ padding: 0 }}>
            <summary style={{ padding: 12, cursor: "pointer", fontSize: 12, fontWeight: 700, listStyle: "none" }}>💡 ¿Pista pedagógica? (3 niveles)</summary>
            <div style={{ padding: "0 12px 12px", fontSize: 12 }} className="muted">
              <p style={{ margin: 0 }}><strong>1:</strong> Mira el rastro en la pista.</p>
              <p style={{ margin: "6px 0 0" }}><strong>2:</strong> Piensa en tiempo — ¿más o menos tiempo congela?</p>
              <p style={{ margin: "6px 0 0" }}><strong>3:</strong> Prueba denominador más grande (ej. 500, 1000).</p>
              <p className="mono" style={{ marginTop: 8, fontSize: 10 }}>Nunca damos valor exacto al inicio — descubres la relación.</p>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}

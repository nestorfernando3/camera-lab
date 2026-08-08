import { useEffect, useMemo, useState } from "react";
import { useLabStore } from "./labStore";
import { MISSIONS } from "../../content/missions";
import { SceneCanvas } from "../../scenes/SceneCanvas";
import { CameraControls } from "./CameraControls";
import { CaptureButton } from "./CaptureButton";
import { ComparisonTray } from "./ComparisonTray";
import { useProgressStore } from "../progress/progressStore";
import { evaluateMission } from "../../domain/learning/evaluateMission";

export function LabScreen({ missionId }: { missionId: string }) {
  const { setMission, settings, phase, captures, hintLevel } = useLabStore();
  const reducedMotion = useProgressStore((s) => s.reducedMotion);
  const mission = MISSIONS.find((m) => m.id === missionId);
  const [showHint, setShowHint] = useState(false);
  useEffect(() => { setMission(missionId); }, [missionId, setMission]);
  if (!mission) return <div style={{ paddingTop: 80 }} className="container">Misión no encontrada</div>;

  const evaluation = useMemo(() => {
    if (captures.length === 0) return null;
    const visible = captures.slice(-mission.maxVisibleCaptures);
    return evaluateMission({ mission, captures: visible });
  }, [captures, mission]);

  const last = captures[captures.length - 1];
  const prev = captures[captures.length - 2];
  const changedParam = useMemo(() => {
    if (!prev || !last) return null;
    const keys: Array<keyof typeof last.settings> = ["aperture", "shutterDenominator", "iso", "focalLengthMm", "subjectDistanceM"];
    for (const k of keys) if (prev.settings[k] !== last.settings[k]) return k;
    return null;
  }, [prev, last]);

  const moduleIndex = ["m1","m2","m3","m4","m5"].indexOf(mission.moduleId) + 1;

  return (
    <>
      <div className="lab__stage">
        <div className="lab__canvas">
          <SceneCanvas sceneId={mission.sceneId} settings={settings} sceneEv100={mission.sceneEv100} reducedMotion={reducedMotion} />
        </div>
        <div className="lab__hud">
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <CaptureButton />
            <span className="mono muted" data-testid="capture-count">{captures.length} capturas</span>
            <span className="pill" data-testid="mission-phase">{phase}</span>
            {evaluation?.passed && <span style={{ background: "var(--accent-green)", color: "#fff", padding: "4px 8px", borderRadius: 999, fontSize: 11, fontWeight: 700 }}>✓ Criterios OK</span>}
          </div>
          <span className="mono muted" style={{ fontSize: 11 }}>{mission.sceneId} · EV{mission.sceneEv100} · {mission.maxVisibleCaptures} visibles</span>
        </div>
      </div>

      <aside className="teach-panel">
        <div className="lesson-header">
          <div className="lesson-number">{moduleIndex || 1}</div>
          <div className="lesson-meta">
            <div className="lesson-category">{mission.moduleId.toUpperCase()} · {mission.sceneId}</div>
            <div className="lesson-title" style={{ fontSize: 18 }}>{mission.titleKey}</div>
          </div>
          <div className="difficulty-badge">
            <span className={`dot ${captures.length >= 1 ? "active" : ""}`} />
            <span className={`dot ${captures.length >= 2 ? "active" : ""}`} />
            <span className={`dot ${evaluation?.passed ? "active" : ""}`} />
          </div>
        </div>

        <div className="panel-scroll">
          <div className="goal-section">
            <div className="section-label"><span className="icon">🎯</span> Tu objetivo</div>
            <p>{mission.briefKey}</p>
            <p className="mono muted" style={{ marginTop: 8, fontSize: 11 }}>{mission.intentKey}</p>
          </div>

          <div className="observe-section">
            <div className="section-label"><span className="icon">👁️</span> Qué observar — después de capturar</div>
            {captures.length === 0 ? (
              <p className="muted" style={{ fontSize: 13 }}>Ajusta un control y captura. Verás aquí si cada métrica está en rango, con ✓ verde o pendiente.</p>
            ) : (
              <ul className="observe-list">
                {evaluation?.ruleResults.map((r) => {
                  const rule = mission.rules[r.ruleIndex];
                  const label = rule.kind === "metric" ? (rule as unknown as { metric: string }).metric : rule.kind;
                  const pass = r.passed;
                  return (
                    <li key={r.ruleIndex} className={pass ? "pass" : "fail"}>
                      <span style={{ flex: 1 }}>{label}: {String(r.actual)} {pass ? "— ✓ en rango" : `— falta (objetivo ${JSON.stringify((rule as unknown as Record<string,unknown>).value ?? (rule as unknown as Record<string,unknown>).maxRelativeDifference)} )`}</span>
                      <span style={{ color: pass ? "var(--accent-green)" : "var(--text-quaternary)" }}>{pass ? "✓" : "○"}</span>
                    </li>
                  );
                })}
              </ul>
            )}
            {last && <div className="mono muted" style={{ marginTop: 8, fontSize: 11 }}>Última: expΔ {last.metrics.exposureDeltaAbs.toFixed(2)} · mov {last.metrics.motionBlurPx.toFixed(1)}px · fondo {last.metrics.backgroundBlurPx.toFixed(1)}px · ruido {last.metrics.noiseStrength.toFixed(2)}</div>}
            {changedParam && <div className="drag-mode-indicator" style={{ marginTop: 8 }}>↻ Cambiaste <strong>{String(changedParam)}</strong> — compara antes/después</div>}
          </div>

          <div className="practice-section">
            <div className="section-label"><span className="icon">📝</span> Práctica</div>
            <div className="practice-card">
              <div className="practice-block"><span className="practice-label">Tarea</span><p>{mission.briefKey}</p></div>
              <div className="practice-block"><span className="practice-label">Qué entregar</span><p>{mission.maxVisibleCaptures} capturas visibles, criterios en verde. Puedes repetir sin límite.</p></div>
            </div>
          </div>

          <div className="diagram-section">
            <div className="section-label"><span className="icon">📐</span> Vista técnica</div>
            <div className="diagram-container" style={{ padding: 12, display: "grid", placeItems: "center" }}>
              <div className="mono muted" style={{ textAlign: "center", fontSize: 11 }}>
                FOV {last ? last.metrics.horizontalFovDeg.toFixed(1) : "—"}° · framing {last ? last.metrics.framingScale.toFixed(1) : "—"}<br />
                {mission.enabledControls.join(" · ")}
              </div>
            </div>
          </div>

          <div style={{ padding: 16 }}>
            <div className="section-label"><span className="icon">💡</span> Pista {hintLevel + 1}/3</div>
            <p className="muted" style={{ fontSize: 13 }} data-testid="hint-text">{mission.hintKeys[hintLevel] ?? mission.hintKeys[0]}</p>
            <button onClick={() => setShowHint(!showHint)} className="btn-ghost" style={{ width: "100%", marginTop: 8, fontSize: 12 }} data-testid="hint-next">{showHint ? "Ocultar" : "Mostrar siguiente pista"}</button>
          </div>
        </div>
      </aside>

      <div className="lab__side">
        <CameraControls mission={mission} />
        <ComparisonTray captures={captures} maxVisible={mission.maxVisibleCaptures} />
        <div className="panel" data-testid="feedback-panel" data-passed={String(!!evaluation?.passed)}>
          <h4 style={{ margin: "0 0 8px", fontSize: 13 }}>¿Vas bien?</h4>
          {captures.length === 0 ? (
            <p className="muted" style={{ fontSize: 12 }}>Captura para ver <strong>Conseguiste / Observa / Compromiso</strong> — te decimos qué ganaste y qué sacrificaste.</p>
          ) : evaluation?.passed ? (
            <><p style={{ color: "var(--accent-green)", fontWeight: 700, fontSize: 13 }}>✓ Conseguiste — criterios en verde arriba.</p><p className="muted" style={{ fontSize: 12, marginTop: 6 }}>Observa el fondo {last.metrics.backgroundBlurPx.toFixed(1)}px y ruido {last.metrics.noiseStrength.toFixed(2)}. Compromiso: {evaluation.tradeOffs[0] ?? "equilibrio luz/mov/nitidez"}</p></>
          ) : (
            <><p className="muted" style={{ fontSize: 12 }}>Aún no — revisa la lista “Qué observar” en rojo. Ajusta y captura de nuevo. Hint no da valor exacto al inicio.</p><p className="mono muted" style={{ marginTop: 6, fontSize: 11 }}>Δ exp {last.metrics.exposureDeltaAbs.toFixed(1)} pasos de referencia</p></>
          )}
        </div>
      </div>
    </>
  );
}

import { useEffect, useMemo } from "react";
import { useLabStore } from "./labStore";
import { MISSIONS } from "../../content/missions";
import { SceneCanvas } from "../../scenes/SceneCanvas";
import { CameraControls } from "./CameraControls";
import { CaptureButton } from "./CaptureButton";
import { MissionPanel } from "./MissionPanel";
import { useProgressStore } from "../progress/progressStore";
import { evaluateMission } from "../../domain/learning/evaluateMission";
import { ComparisonTray } from "./ComparisonTray";
import { HintPanel } from "./HintPanel";

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

  // Step 1: minimal - no teach-panel, just centered lab
  return (
    <div style={{ paddingTop: 64 }}>
      <div style={{ width: "min(1100px, 96vw)", margin: "0 auto", padding: 16, display: "grid", gridTemplateColumns: "1.4fr 0.8fr", gap: 16 }}>
        <div>
          <div style={{ borderRadius: 14, overflow: "hidden", border: "1px solid var(--glass-border-subtle)", background: "var(--color-bg-secondary)" }}>
            <SceneCanvas sceneId={mission.sceneId} settings={settings} sceneEv100={mission.sceneEv100} reducedMotion={reducedMotion} />
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 12, flexWrap: "wrap" }}>
            <CaptureButton />
            <span className="mono muted" data-testid="capture-count">{captures.length} captura{captures.length===1?"":"s"}</span>
            <span className="pill" data-testid="mission-phase">{phase}</span>
            {evaluation?.passed && <span style={{ background: "var(--accent-green)", color: "#fff", padding: "4px 10px", borderRadius: 999, fontSize: 12, fontWeight: 700 }}>✓ Correcto</span>}
          </div>
          {captures.length === 0 ? (
            <div className="panel" style={{ marginTop: 12, background: "var(--glass-bg)", border: "1px solid var(--glass-border-subtle)" }}>
              <p className="muted" style={{ fontSize: 13, margin: 0 }}>👉 Ajusta <strong>Obturación</strong> a la derecha y pulsa <strong>Capturar</strong>. Verás al instante si congelaste.</p>
            </div>
          ) : evaluation?.passed ? (
            <div className="panel" style={{ marginTop: 12, borderColor: "rgba(52,208,88,0.3)", background: "rgba(52,208,88,0.08)" }} data-testid="feedback-panel" data-passed="true">
              <h4 style={{ margin: 0, color: "var(--accent-green)" }}>✓ ¡Bien! Congelado — mov {last.metrics.motionBlurPx.toFixed(1)}px ≤ 4</h4>
              <p className="muted" style={{ fontSize: 12, margin: "6px 0 0" }}>Conseguiste: rastro mínimo. Prueba otra velocidad para comparar.</p>
            </div>
          ) : (
            <div className="panel" style={{ marginTop: 12 }} data-testid="feedback-panel" data-passed="false">
              <h4 style={{ margin: 0, fontSize: 14 }}>Aún movido — {last.metrics.motionBlurPx.toFixed(1)}px</h4>
              <p className="muted" style={{ fontSize: 12, margin: "6px 0 0" }}>Necesitas ≤ 4px. Prueba <strong>1/500 o 1/1000</strong> (más rápido = menos rastro).</p>
              <p className="mono muted" style={{ fontSize: 11, marginTop: 6 }}>Actual: 1/{last.settings.shutterDenominator} → {last.metrics.motionBlurPx.toFixed(1)}px</p>
            </div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div className="panel">
            <MissionPanel mission={mission} phase={phase} />
          </div>
          <CameraControls mission={mission} />
          <div className="panel">
            <h4 style={{ margin: "0 0 6px", fontSize: 12 }}>¿Qué hace la obturación?</h4>
            <p className="muted" style={{ fontSize: 12, margin: 0 }}>Tiempo que el sensor ve movimiento. <strong>1/30</strong> = arrastra, <strong>1/1000</strong> = congela. Mueve y captura para ver.</p>
          </div>
          {mission.maxVisibleCaptures > 1 && captures.length > 0 && (
            <ComparisonTray captures={captures} maxVisible={mission.maxVisibleCaptures} />
          )}
          <details className="panel" style={{ padding: 0 }}>
            <summary style={{ padding: 12, cursor: "pointer", fontSize: 12, fontWeight: 700, listStyle: "none" }}>💡 ¿Pista? (opcional)</summary>
            <div style={{ padding: "0 12px 12px" }}>
              <HintPanel mission={mission} />
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}

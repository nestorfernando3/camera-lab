import { useLabStore } from "./labStore";
import { MISSIONS } from "../../content/missions";
import { SceneCanvas } from "../../scenes/SceneCanvas";
import { CameraControls } from "./CameraControls";
import { CaptureButton } from "./CaptureButton";
import { MissionPanel } from "./MissionPanel";
import { ComparisonTray } from "./ComparisonTray";
import { HintPanel } from "./HintPanel";
import { FeedbackPanel } from "./FeedbackPanel";
import { useEffect } from "react";
import { ModuleSummary } from "../summary/ModuleSummary";
import { useProgressStore } from "../progress/progressStore";

export function LabScreen({ missionId }: { missionId: string }) {
  const { setMission, settings, phase, captures } = useLabStore();
  const reducedMotion = useProgressStore((s) => s.reducedMotion);
  const mission = MISSIONS.find((m) => m.id === missionId);
  useEffect(() => { setMission(missionId); }, [missionId, setMission]);
  if (!mission) return <div className="container" style={{ padding: 24 }}>Misión no encontrada</div>;

  return (
    <div className="lab">
      <div className="lab__stage">
        <div className="lab__canvas">
          <SceneCanvas sceneId={mission.sceneId} settings={settings} sceneEv100={mission.sceneEv100} reducedMotion={reducedMotion} />
        </div>
        <div className="lab__hud">
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <CaptureButton />
            <span className="mono muted" data-testid="capture-count">{captures.length} capturas · {mission.maxVisibleCaptures} visibles</span>
            <span className="pill" data-testid="mission-phase">{phase}</span>
          </div>
          <span className="mono" style={{ color: "var(--muted)", fontSize: 11 }}>{mission.sceneId} · EV{mission.sceneEv100}</span>
        </div>
      </div>

      <div className="lab__side">
        <div className="panel">
          <MissionPanel mission={mission} phase={phase} />
        </div>
        <CameraControls mission={mission} />
        <HintPanel mission={mission} />
        <FeedbackPanel mission={mission} captures={captures} />
        <ComparisonTray captures={captures} maxVisible={mission.maxVisibleCaptures} />
        <ModuleSummary captures={captures} moduleId={mission.moduleId} />
      </div>
    </div>
  );
}

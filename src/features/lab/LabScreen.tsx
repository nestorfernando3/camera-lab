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

export function LabScreen({ missionId }: { missionId: string }) {
  const { setMission, settings, phase, captures } = useLabStore();
  const mission = MISSIONS.find((m) => m.id === missionId);

  useEffect(() => {
    setMission(missionId);
  }, [missionId, setMission]);

  if (!mission) return <div>Misión no encontrada</div>;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: "12px", padding: "12px" }}>
      <div>
        <SceneCanvas sceneId={mission.sceneId} settings={settings} sceneEv100={mission.sceneEv100} />
        <div style={{ marginTop: "8px", display: "flex", gap: "8px", alignItems: "center" }}>
          <CaptureButton />
          <span style={{ fontSize: "12px", color: "var(--muted)" }} data-testid="capture-count">
            Capturas: {captures.length}
          </span>
        </div>
        <ComparisonTray captures={captures} maxVisible={mission.maxVisibleCaptures} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <MissionPanel mission={mission} phase={phase} />
        <CameraControls mission={mission} />
        <HintPanel mission={mission} />
        <FeedbackPanel mission={mission} captures={captures} />
      </div>
    </div>
  );
}

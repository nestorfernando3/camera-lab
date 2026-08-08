import type { MissionDefinition } from "../../domain/learning/types";
export function MissionPanel({ mission, phase }: { mission: MissionDefinition; phase: string }) {
  return (
    <div data-testid="mission-panel">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span className="pill">{mission.moduleId.toUpperCase()} · {mission.sceneId}</span>
        <span className="mono muted" data-testid="mission-phase">{phase}</span>
      </div>
      <h3 style={{ margin: 0 }}>{mission.titleKey}</h3>
      <p className="muted" style={{ margin: "6px 0 0", fontSize: 13, lineHeight: 1.4 }}>{mission.briefKey}</p>
      <p className="mono muted" style={{ margin: "10px 0 0", fontSize: 11, borderTop: "1px solid var(--border)", paddingTop: 10 }}>{mission.intentKey}</p>
    </div>
  );
}

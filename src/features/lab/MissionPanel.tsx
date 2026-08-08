import type { MissionDefinition } from "../../domain/learning/types";

export function MissionPanel({ mission, phase }: { mission: MissionDefinition; phase: string }) {
  return (
    <div style={{ padding: "12px", border: "1px solid var(--border)", background: "var(--panel)" }} data-testid="mission-panel">
      <h3 style={{ margin: "0 0 8px" }}>{mission.titleKey}</h3>
      <p style={{ margin: "0 0 8px", color: "var(--muted)", fontSize: "13px" }}>{mission.briefKey}</p>
      <p style={{ margin: 0, fontSize: "12px" }} data-testid="mission-phase">Fase: {phase}</p>
      <p style={{ margin: "8px 0 0", fontSize: "12px", color: "var(--muted)" }}>{mission.intentKey}</p>
    </div>
  );
}

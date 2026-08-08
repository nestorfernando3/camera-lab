import type { MissionDefinition } from "../../domain/learning/types";
import { hintForAttempt } from "../../domain/learning/hints";
import { useLabStore } from "./labStore";

export function HintPanel({ mission }: { mission: MissionDefinition }) {
  const { hintLevel, nextHint } = useLabStore();
  const hintKey = hintForAttempt(mission, hintLevel as 0 | 1 | 2);

  return (
    <div style={{ padding: "10px", border: "1px solid var(--border)", background: "var(--panel)" }} data-testid="hint-panel">
      <h4 style={{ margin: "0 0 6px", fontSize: "13px" }}>Pista {hintLevel + 1}/3</h4>
      <p style={{ margin: 0, fontSize: "12px", color: "var(--muted)" }} data-testid="hint-text">
        {hintKey}
      </p>
      <button
        onClick={nextHint}
        disabled={hintLevel >= 2}
        data-testid="hint-next"
        style={{ marginTop: "8px", padding: "6px 10px", fontSize: "12px" }}
      >
        {hintLevel >= 2 ? "Sin más pistas" : "Siguiente pista"}
      </button>
      <p style={{ fontSize: "10px", color: "var(--muted)", margin: "6px 0 0" }}>Las pistas nunca revelan el ajuste exacto al inicio.</p>
    </div>
  );
}

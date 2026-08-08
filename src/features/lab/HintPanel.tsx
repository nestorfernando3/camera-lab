import type { MissionDefinition } from "../../domain/learning/types";
import { hintForAttempt } from "../../domain/learning/hints";
import { useLabStore } from "./labStore";
export function HintPanel({ mission }: { mission: MissionDefinition }) {
  const { hintLevel, nextHint } = useLabStore();
  const hintKey = hintForAttempt(mission, hintLevel as 0|1|2);
  return (
    <div className="panel" data-testid="hint-panel">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <h4 style={{ margin: 0 }}>Pista</h4><span className="pill">{hintLevel+1}/3</span>
      </div>
      <p className="muted" style={{ margin: 0, fontSize: 13, lineHeight: 1.5 }} data-testid="hint-text">{hintKey}</p>
      <button onClick={nextHint} disabled={hintLevel>=2} data-testid="hint-next" className="btn-ghost" style={{ width: "100%", marginTop: 10, fontSize: 12, opacity: hintLevel>=2?0.5:1 }}>
        {hintLevel>=2 ? "Sin más pistas" : "Siguiente pista →"}
      </button>
      <p className="mono muted" style={{ margin: "8px 0 0", fontSize: 10 }}>Las pistas nunca revelan el ajuste exacto al inicio.</p>
    </div>
  );
}

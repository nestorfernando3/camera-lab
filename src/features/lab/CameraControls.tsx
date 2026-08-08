import { APERTURES, FOCAL_LENGTHS, ISO_VALUES, SHUTTER_DENOMINATORS, SUBJECT_DISTANCES } from "../../domain/camera/constants";
import type { MissionDefinition } from "../../domain/learning/types";
import { useLabStore } from "./labStore";

const FOCUS_OPTIONS = ["portrait-subject", "depth-foreground", "depth-mid", "depth-background", "depth-far", "runner-subject"];

export function CameraControls({ mission }: { mission: MissionDefinition }) {
  const { settings, setSetting } = useLabStore();
  const show = (c: string) => mission.enabledControls.includes(c as never);
  return (
    <div className="panel controls" data-testid="camera-controls">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h4 style={{ margin: 0 }}>Controles</h4>
        <span className="pill">Solo lo necesario</span>
      </div>

      {show("aperture") && (
        <div className="control-group">
          <label>Apertura — Apertura / f</label>
          <div className="segmented">
            {APERTURES.map((a) => (
              <button key={a} aria-label={`Apertura f/${a}`} aria-pressed={settings.aperture === a} className="seg-btn" onClick={() => setSetting("aperture", a)}>f/{a}</button>
            ))}
          </div>
          <div className="mono muted" style={{ marginTop: 6 }}>Actual: f/{settings.aperture} · {settings.aperture <= 2.8 ? "poca profundidad" : settings.aperture >= 8 ? "mucha profundidad" : "equilibrado"}</div>
        </div>
      )}

      {show("shutter") && (
        <div className="control-group">
          <label>Obturación — Shutter speed</label>
          <div className="segmented">
            {SHUTTER_DENOMINATORS.map((s) => (
              <button key={s} aria-label={`Obturador 1/${s}`} aria-pressed={settings.shutterDenominator === s} className="seg-btn" onClick={() => setSetting("shutterDenominator", s)}>1/{s}</button>
            ))}
          </div>
          <div className="mono muted" style={{ marginTop: 6 }}>Actual: 1/{settings.shutterDenominator} · {settings.shutterDenominator >= 500 ? "congela" : settings.shutterDenominator <= 30 ? "arrastra" : "medio"}</div>
        </div>
      )}

      {show("iso") && (
        <div className="control-group">
          <label>ISO — Sensibilidad</label>
          <div className="segmented">
            {ISO_VALUES.map((iso) => (
              <button key={iso} aria-label={`ISO ${iso}`} aria-pressed={settings.iso === iso} className="seg-btn" onClick={() => setSetting("iso", iso)}>{iso}</button>
            ))}
          </div>
          <div className="mono muted" style={{ marginTop: 6 }}>Actual: ISO {settings.iso} {settings.iso >= 800 ? "· ruido visible" : "· limpio"}</div>
        </div>
      )}

      {show("focalLength") && (
        <div className="control-group">
          <label>Focal — Focal length</label>
          <div className="segmented">
            {FOCAL_LENGTHS.map((f) => (
              <button key={f} aria-label={`Focal ${f}mm`} aria-pressed={settings.focalLengthMm === f} className="seg-btn" onClick={() => setSetting("focalLengthMm", f)}>{f}mm</button>
            ))}
          </div>
          <div className="mono muted" style={{ marginTop: 6 }}>Actual: {settings.focalLengthMm}mm · {settings.focalLengthMm <= 35 ? "angular" : settings.focalLengthMm >= 85 ? "tele" : "normal"}</div>
        </div>
      )}

      {show("subjectDistance") && (
        <div className="control-group">
          <label>Distancia — Subject distance</label>
          <div className="segmented">
            {SUBJECT_DISTANCES.map((d) => (
              <button key={d} aria-label={`Distancia ${d}m`} aria-pressed={settings.subjectDistanceM === d} className="seg-btn" onClick={() => setSetting("subjectDistanceM", d)}>{d}m</button>
            ))}
          </div>
          <div className="mono muted" style={{ marginTop: 6 }}>Actual: {settings.subjectDistanceM}m</div>
        </div>
      )}

      {show("focusTarget") && (
        <div className="control-group">
          <label>Enfoque — Focus target</label>
          <div className="segmented">
            {FOCUS_OPTIONS.slice(0, 4).map((t) => (
              <button key={t} aria-label={`Enfoque ${t}`} aria-pressed={settings.focusTargetId === t} className="seg-btn" onClick={() => setSetting("focusTargetId", t)}>{t.replace("depth-", "").replace("portrait-", "")}</button>
            ))}
          </div>
        </div>
      )}

      {show("panning") && (
        <div className="control-group">
          <label>Barrido — Panning</label>
          <button aria-label="Activar panning" aria-pressed={settings.panningEnabled} onClick={() => setSetting("panningEnabled", !settings.panningEnabled)} className="seg-btn" style={{ width: "100%", justifyContent: "center", display: "flex" }}>
            {settings.panningEnabled ? "● Panning ON — siguiendo sujeto" : "○ Panning OFF"}
          </button>
        </div>
      )}
    </div>
  );
}

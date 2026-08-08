import { APERTURES, FOCAL_LENGTHS, ISO_VALUES, SHUTTER_DENOMINATORS, SUBJECT_DISTANCES } from "../../domain/camera/constants";
import type { MissionDefinition } from "../../domain/learning/types";
import { useLabStore } from "./labStore";

const FOCUS_OPTIONS = ["portrait-subject", "depth-foreground", "depth-mid", "depth-background", "depth-far", "runner-subject"];

export function CameraControls({ mission }: { mission: MissionDefinition }) {
  const { settings, setSetting } = useLabStore();

  const show = (ctrl: string) => mission.enabledControls.includes(ctrl as never);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px", padding: "12px", border: "1px solid var(--border)", background: "var(--panel)" }} data-testid="camera-controls">
      {show("aperture") && (
        <div>
          <label style={{ fontSize: "12px", color: "var(--muted)" }}>Apertura / Aperture (f)</label>
          <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginTop: "4px" }}>
            {APERTURES.map((a) => (
              <button
                key={a}
                aria-label={`Apertura f/${a}`}
                aria-pressed={settings.aperture === a}
                onClick={() => setSetting("aperture", a)}
                style={{
                  padding: "6px 8px",
                  background: settings.aperture === a ? "var(--accent)" : "transparent",
                  border: "1px solid var(--border)",
                  cursor: "pointer",
                }}
              >
                f/{a}
              </button>
            ))}
          </div>
          <div aria-live="polite" style={{ fontSize: "12px", marginTop: "4px" }}>Actual: f/{settings.aperture}</div>
        </div>
      )}

      {show("shutter") && (
        <div>
          <label style={{ fontSize: "12px", color: "var(--muted)" }}>Velocidad de obturación / Shutter speed</label>
          <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginTop: "4px" }}>
            {SHUTTER_DENOMINATORS.map((s) => (
              <button
                key={s}
                aria-label={`Obturador 1/${s}`}
                aria-pressed={settings.shutterDenominator === s}
                onClick={() => setSetting("shutterDenominator", s)}
                style={{
                  padding: "6px 8px",
                  background: settings.shutterDenominator === s ? "var(--accent)" : "transparent",
                  border: "1px solid var(--border)",
                  cursor: "pointer",
                }}
              >
                1/{s}
              </button>
            ))}
          </div>
          <div style={{ fontSize: "12px", marginTop: "4px" }}>Actual: 1/{settings.shutterDenominator}</div>
        </div>
      )}

      {show("iso") && (
        <div>
          <label style={{ fontSize: "12px", color: "var(--muted)" }}>ISO</label>
          <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginTop: "4px" }}>
            {ISO_VALUES.map((iso) => (
              <button
                key={iso}
                aria-label={`ISO ${iso}`}
                aria-pressed={settings.iso === iso}
                onClick={() => setSetting("iso", iso)}
                style={{
                  padding: "6px 8px",
                  background: settings.iso === iso ? "var(--accent)" : "transparent",
                  border: "1px solid var(--border)",
                  cursor: "pointer",
                }}
              >
                {iso}
              </button>
            ))}
          </div>
          <div style={{ fontSize: "12px", marginTop: "4px" }}>Actual: ISO {settings.iso}</div>
        </div>
      )}

      {show("focalLength") && (
        <div>
          <label style={{ fontSize: "12px", color: "var(--muted)" }}>Distancia focal / Focal length</label>
          <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginTop: "4px" }}>
            {FOCAL_LENGTHS.map((f) => (
              <button
                key={f}
                aria-label={`Focal ${f}mm`}
                aria-pressed={settings.focalLengthMm === f}
                onClick={() => setSetting("focalLengthMm", f)}
                style={{
                  padding: "6px 8px",
                  background: settings.focalLengthMm === f ? "var(--accent)" : "transparent",
                  border: "1px solid var(--border)",
                  cursor: "pointer",
                }}
              >
                {f}mm
              </button>
            ))}
          </div>
          <div style={{ fontSize: "12px", marginTop: "4px" }}>Actual: {settings.focalLengthMm}mm</div>
        </div>
      )}

      {show("subjectDistance") && (
        <div>
          <label style={{ fontSize: "12px", color: "var(--muted)" }}>Distancia al sujeto / Subject distance</label>
          <div style={{ display: "flex", gap: "4px", marginTop: "4px" }}>
            {SUBJECT_DISTANCES.map((d) => (
              <button
                key={d}
                aria-label={`Distancia ${d}m`}
                aria-pressed={settings.subjectDistanceM === d}
                onClick={() => setSetting("subjectDistanceM", d)}
                style={{
                  padding: "6px 8px",
                  background: settings.subjectDistanceM === d ? "var(--accent)" : "transparent",
                  border: "1px solid var(--border)",
                  cursor: "pointer",
                }}
              >
                {d}m
              </button>
            ))}
          </div>
          <div style={{ fontSize: "12px", marginTop: "4px" }}>Actual: {settings.subjectDistanceM}m</div>
        </div>
      )}

      {show("focusTarget") && (
        <div>
          <label style={{ fontSize: "12px", color: "var(--muted)" }}>Enfoque / Focus target</label>
          <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginTop: "4px" }}>
            {FOCUS_OPTIONS.slice(0, 4).map((t) => (
              <button
                key={t}
                aria-label={`Enfoque ${t}`}
                aria-pressed={settings.focusTargetId === t}
                onClick={() => setSetting("focusTargetId", t)}
                style={{
                  padding: "6px 8px",
                  background: settings.focusTargetId === t ? "var(--accent)" : "transparent",
                  border: "1px solid var(--border)",
                  cursor: "pointer",
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      )}

      {show("panning") && (
        <div>
          <label style={{ fontSize: "12px", color: "var(--muted)" }}>Barrido / Panning</label>
          <button
            aria-label="Activar panning"
            aria-pressed={settings.panningEnabled}
            onClick={() => setSetting("panningEnabled", !settings.panningEnabled)}
            style={{
              padding: "6px 12px",
              marginTop: "4px",
              background: settings.panningEnabled ? "var(--accent)" : "transparent",
              border: "1px solid var(--border)",
              cursor: "pointer",
            }}
          >
            {settings.panningEnabled ? "Panning ON" : "Panning OFF"}
          </button>
        </div>
      )}
    </div>
  );
}

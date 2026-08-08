import { useState } from "react";
import { PRESETS } from "../../content/presets";
import { SceneCanvas } from "../../scenes/SceneCanvas";
import type { CameraSettings } from "../../domain/camera/types";
import { useLabStore } from "../lab/labStore";

const DEFAULT_SANDBOX: CameraSettings = {
  aperture: 4,
  shutterDenominator: 125,
  iso: 200,
  focalLengthMm: 50,
  subjectDistanceM: 2,
  focusMode: "auto-subject",
  focusTargetId: "portrait-subject",
  panningEnabled: false,
};

export function SandboxScreen() {
  const [settings, setSettings] = useState<CameraSettings>(DEFAULT_SANDBOX);
  const applyPreset = (id: string) => {
    const preset = PRESETS.find((p) => p.id === id);
    if (!preset) return;
    setSettings((s) => ({ ...s, ...preset.settings }));
  };

  const labCapture = useLabStore((s) => s.capture);

  return (
    <div style={{ padding: "12px" }}>
      <h1>Sandbox</h1>
      <p style={{ color: "var(--muted)", fontSize: "12px" }}>Todos los controles visibles. Los preajustes muestran inmediatamente cada parámetro cambiado.</p>

      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", margin: "12px 0" }}>
        {PRESETS.map((p) => (
          <button key={p.id} onClick={() => applyPreset(p.id)} data-testid={`preset-${p.id}`}>
            {p.labelKey}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: "12px" }}>
        <SceneCanvas sceneId="portrait" settings={settings} sceneEv100={10} />
        <div style={{ padding: "12px", border: "1px solid var(--border)", fontSize: "12px" }} data-testid="sandbox-settings">
          <div>f/{settings.aperture}</div>
          <div>1/{settings.shutterDenominator}</div>
          <div>ISO {settings.iso}</div>
          <div>{settings.focalLengthMm}mm</div>
          <div>{settings.subjectDistanceM}m</div>
          <div>Panning: {String(settings.panningEnabled)}</div>
          <button onClick={() => labCapture()} style={{ marginTop: "8px" }} data-testid="sandbox-capture">
            Capturar
          </button>
        </div>
      </div>
    </div>
  );
}

import { useProgressStore } from "../progress/progressStore";
import { useAppStore } from "../../app/appStore";
import { exportTelemetry, downloadTelemetry } from "../telemetry/exportTelemetry";
import { useState } from "react";

export function SettingsPanel() {
  const { reducedMotion, soundEnabled, locale, setReducedMotion, setSoundEnabled, setLocale, resetAll } = useProgressStore();
  const [presentationMode, setPresentationMode] = useState(() => {
    try {
      return localStorage.getItem("cameralab:v1:presentation") === "true";
    } catch {
      return false;
    }
  });

  const togglePresentation = (v: boolean) => {
    setPresentationMode(v);
    try {
      localStorage.setItem("cameralab:v1:presentation", String(v));
    } catch {}
    if (v) document.documentElement.style.fontSize = "18px";
    else document.documentElement.style.removeProperty("font-size");
  };

  return (
    <div style={{ padding: "24px", maxWidth: "600px", margin: "0 auto" }} data-testid="settings-panel">
      <h1>Ajustes</h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "16px" }}>
        <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <input type="checkbox" checked={reducedMotion} onChange={(e) => setReducedMotion(e.target.checked)} aria-label="Reducir movimiento" />
          Reducir movimiento / Reduce motion
        </label>

        <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <input type="checkbox" checked={soundEnabled} onChange={(e) => setSoundEnabled(e.target.checked)} aria-label="Sonido obturador" />
          Sonido de obturación (sintetizado) / Shutter sound
        </label>

        <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <input type="checkbox" checked={presentationMode} onChange={(e) => togglePresentation(e.target.checked)} aria-label="Modo presentación" />
          Modo presentación / Presentation mode {presentationMode && "(texto grande)"}
        </label>

        <label>
          Idioma / Language
          <select value={locale} onChange={(e) => setLocale(e.target.value as "es" | "en")} aria-label="Idioma" style={{ marginLeft: "8px" }}>
            <option value="es">Español</option>
            <option value="en">English</option>
          </select>
        </label>

        <div style={{ borderTop: "1px solid var(--border)", paddingTop: "16px" }}>
          <button
            onClick={async () => {
              const blob = await exportTelemetry();
              downloadTelemetry(blob);
            }}
            data-testid="export-telemetry"
          >
            Exportar datos de aprendizaje / Export learning data
          </button>
        </div>

        <div style={{ borderTop: "1px solid var(--border)", paddingTop: "16px" }}>
          <button
            onClick={() => {
              if (confirm("¿Reiniciar todo CameraLab? Se borrará progreso local y telemetría.")) resetAll();
            }}
            style={{ color: "#e85d4d" }}
            data-testid="reset-all"
          >
            Reiniciar todo / Reset all
          </button>
          <button
            onClick={() => useAppStore.getState().navigate("curriculum")}
            style={{ marginLeft: "12px" }}
          >
            Repetir actividad
          </button>
        </div>
      </div>
    </div>
  );
}

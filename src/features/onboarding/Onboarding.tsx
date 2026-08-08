import { useState } from "react";
import { useAppStore } from "../../app/appStore";
import { guidanceFromActions } from "./diagnostic";

export function Onboarding() {
  const navigate = useAppStore((s) => s.navigate);
  const [step, setStep] = useState(1);
  const [choices, setChoices] = useState<Array<{ shutterDenominator?: number; aperture?: number }>>([]);
  const [guidance, setGuidance] = useState<string | null>(null);

  const handleShutterChoice = (den: number) => {
    const next = [...choices, { shutterDenominator: den }];
    setChoices(next);
    setStep(2);
  };

  const handleApertureChoice = (ap: number) => {
    const next = [...choices, { aperture: ap }];
    setChoices(next);
    const mode = guidanceFromActions(next);
    setGuidance(mode);
    // Store guidance preference in localStorage for later hint timing
    try {
      localStorage.setItem("cameralab:v1:guidance", mode);
    } catch {}
    setStep(3);
  };

  if (step === 1) {
    return (
      <div style={{ padding: "24px", maxWidth: "600px", margin: "0 auto" }}>
        <h1>Bienvenido a CameraLab</h1>
        <p>Elige obturación para congelar al corredor:</p>
        <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
          {[30, 125, 500].map((d) => (
            <button key={d} onClick={() => handleShutterChoice(d)} data-testid={`onboard-shutter-${d}`}>
              1/{d}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div style={{ padding: "24px", maxWidth: "600px", margin: "0 auto" }}>
        <h2>Ahora apertura para separar fondo</h2>
        <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
          {[2, 4, 8].map((a) => (
            <button key={a} onClick={() => handleApertureChoice(a)} data-testid={`onboard-aperture-${a}`}>
              f/{a}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px", maxWidth: "600px", margin: "0 auto" }}>
      <h2>Listo</h2>
      <p>Modo de guía: {guidance === "more" ? "Más apoyo" : "Estándar"}</p>
      <p style={{ fontSize: "12px", color: "var(--muted)" }}>Este ajuste cambia la disponibilidad de pistas, no el contenido.</p>
      <button onClick={() => navigate("curriculum")} data-testid="onboard-continue">
        Ir al currículo
      </button>
    </div>
  );
}

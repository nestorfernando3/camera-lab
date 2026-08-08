import { useLabStore } from "./labStore";
import { useShutterSound } from "../../shared/hooks/useShutterSound";
import { useProgressStore } from "../progress/progressStore";

export function CaptureButton() {
  const capture = useLabStore((s) => s.capture);
  const soundEnabled = useProgressStore((s) => s.soundEnabled);
  const play = useShutterSound(soundEnabled);
  return (
    <button onClick={() => { play(); capture(); }} aria-label="Tomar foto" data-testid="capture-button" className="capture-btn">
      <span style={{ width: 10, height: 10, borderRadius: "50%", background: "currentColor", display: "inline-block" }} /> Capturar
    </button>
  );
}

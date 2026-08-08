import { useLabStore } from "./labStore";

export function CaptureButton() {
  const capture = useLabStore((s) => s.capture);
  return (
    <button
      onClick={capture}
      aria-label="Tomar foto"
      data-testid="capture-button"
      style={{
        padding: "12px 20px",
        background: "var(--accent)",
        color: "#111",
        border: "none",
        borderRadius: "6px",
        fontWeight: 700,
        cursor: "pointer",
        fontSize: "16px",
      }}
    >
      ● Capturar
    </button>
  );
}

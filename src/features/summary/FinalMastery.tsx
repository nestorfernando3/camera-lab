import { useProgressStore } from "../progress/progressStore";

const LABELS: Record<string, string> = {
  unexplored: "Por explorar",
  developing: "En desarrollo",
  solid: "Sólido",
};

export function FinalMastery() {
  const mastery = useProgressStore((s) => s.mastery);
  const completed = useProgressStore((s) => s.completedMissionIds);

  if (completed.length === 0) {
    return (
      <div style={{ padding: "24px" }} data-testid="final-mastery">
        <h1>Perfil final</h1>
        <p style={{ color: "var(--muted)" }}>Completa misiones para ver tu perfil. No hay examen ni certificado — solo evidencia de aprendizaje.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px" }} data-testid="final-mastery">
      <h1>Perfil de dominio</h1>
      <p style={{ fontSize: "12px", color: "var(--muted)" }}>Sin nota numérica. Cada dominio muestra Sólido / En desarrollo / Por explorar.</p>
      <ul style={{ marginTop: "16px" }}>
        {Object.entries(mastery).map(([concept, level]) => (
          <li key={concept} style={{ margin: "6px 0" }} data-testid={`mastery-${concept}`}>
            {concept}: {LABELS[level as string] ?? level}
          </li>
        ))}
      </ul>
      <section style={{ marginTop: "24px", padding: "12px", border: "1px solid var(--border)" }}>
        <h3>Transferencia</h3>
        <p style={{ fontSize: "12px" }}>Has practicado decisiones con compromiso real. Aplica lo aprendido en Sandbox y desafíos avanzados.</p>
      </section>
    </div>
  );
}

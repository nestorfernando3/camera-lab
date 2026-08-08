export function ReferenceSheet() {
  return (
    <div style={{ padding: "24px", maxWidth: "800px", margin: "0 auto" }} data-testid="reference-sheet">
      <h1>Hoja de referencia / Reference sheet</h1>
      <section>
        <h2>Escala de apertura</h2>
        <p>f/1.4 · f/2 · f/2.8 · f/4 · f/5.6 · f/8 · f/11 · f/16</p>
      </section>
      <section>
        <h2>Escala de obturación</h2>
        <p>1/15 · 1/30 · 1/60 · 1/125 · 1/250 · 1/500 · 1/1000 · 1/2000</p>
      </section>
      <section>
        <h2>ISO</h2>
        <p>100 · 200 · 400 · 800 · 1600 · 3200</p>
      </section>
      <section>
        <h2>Un paso / One stop</h2>
        <p>Doble/mitad de luz. Ej: f/2.8 → f/4, 1/60 → 1/125, ISO 100 → ISO 200 deben compensarse.</p>
      </section>
      <section>
        <h2>Focales</h2>
        <p>24mm angular · 35mm angular moderado · 50mm normal · 85mm tele corto · 135mm tele</p>
      </section>
      <section>
        <h2>Causa / efecto</h2>
        <ul>
          <li>Apertura ↓ (f menor) → más luz + menos profundidad de campo</li>
          <li>Obturación más tiempo (denominador menor) → más luz + más desenfoque de movimiento</li>
          <li>ISO ↑ → más luz + más ruido</li>
          <li>Focal ↑ → encuadre más cerrado, fondo más borroso</li>
          <li>Distancia ↓ → sujeto más grande, profundidad más estrecha</li>
        </ul>
      </section>
    </div>
  );
}

export function ReferenceSheet() {
  return (
    <div className="container section" data-testid="reference-sheet" style={{ maxWidth: 760 }}>
      <div className="pill" style={{ marginBottom: 12 }}>Fuera del flujo · siempre disponible</div>
      <h1 style={{ margin: "0 0 8px" }}>Hoja de referencia</h1>
      <p className="muted">Todo lo que necesitas para decidir sin memorizar de más.</p>
      <div style={{ display:"grid", gap:14, marginTop:18 }}>
        <div className="panel"><h3>Apertura · f</h3><p className="mono">f/1.4 · f/2 · f/2.8 · f/4 · f/5.6 · f/8 · f/11 · f/16</p><p className="muted" style={{fontSize:13}}>f menor → más luz + menos profundidad. Cada paso = mitad/doble luz.</p></div>
        <div className="panel"><h3>Obturación · s</h3><p className="mono">1/15 · 1/30 · 1/60 · 1/125 · 1/250 · 1/500 · 1/1000 · 1/2000</p><p className="muted" style={{fontSize:13}}>Tiempo largo → más luz + más movimiento. Cada paso = mitad/doble.</p></div>
        <div className="panel"><h3>ISO</h3><p className="mono">100 · 200 · 400 · 800 · 1600 · 3200</p><p className="muted" style={{fontSize:13}}>Amplifica señal: más luz pero más grano. 100→200 es 1 paso.</p></div>
        <div className="panel" style={{ borderColor:"var(--accent)" }}><h3>Un paso = doble luz</h3><p style={{fontSize:14}}>Ej: <span className="mono">f/2.8 → f/4</span> cierra 1 paso → debes compensar con <span className="mono">1/60 → 1/30</span> o <span className="mono">ISO100 →200</span>.</p></div>
        <div className="panel"><h3>Focales</h3><p className="mono">24mm angular · 35mm angular moderado · 50mm normal · 85mm tele corto · 135mm tele</p><p className="muted" style={{fontSize:13}}>Focal larga cierra encuadre y aumenta desenfoque de fondo a misma distancia.</p></div>
        <div className="panel"><h3>Causa → efecto (para decidir)</h3><ul className="muted" style={{ margin:0, paddingLeft:16, fontSize:13, lineHeight:1.6 }}><li><strong>Apertura ↓</strong> (f menor) → más luz + fondo más borroso</li><li><strong>Obturación más lenta</strong> (denominador menor) → más luz + más rastro</li><li><strong>ISO ↑</strong> → más luz + más ruido</li><li><strong>Focal ↑</strong> → encuadre cerrado + fondo más borroso</li><li><strong>Distancia ↓</strong> → sujeto más grande + DOF más estrecha</li></ul></div>
      </div>
    </div>
  );
}

import { useProgressStore } from "../progress/progressStore";
const LABELS:Record<string,string>={unexplored:"Por explorar",developing:"En desarrollo",solid:"Sólido"};
export function FinalMastery(){
  const mastery=useProgressStore(s=>s.mastery);
  const completed=useProgressStore(s=>s.completedMissionIds);
  if(completed.length===0) return <div className="container section" data-testid="final-mastery" style={{maxWidth:720}}><div className="pill" style={{marginBottom:12}}>Perfil · sin examen</div><h1>Tu perfil se construye haciendo</h1><p className="muted">Completa misiones y verás aquí tu dominio por concepto — sin nota numérica, sin certificado, solo evidencia.</p><div className="panel" style={{marginTop:16}}><p className="mono muted">Aún no hay datos. Prueba <strong>M1.1</strong> y vuelve.</p></div></div>;
  return (
    <div className="container section" data-testid="final-mastery" style={{maxWidth:760}}>
      <div className="pill" style={{marginBottom:12}}>Perfil · {completed.length}/15 misiones</div>
      <h1>Perfil de dominio</h1>
      <p className="muted">Sin nota. Cada dominio: <strong>Sólido</strong> / <strong>En desarrollo</strong> / <strong>Por explorar</strong>.</p>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(180px,1fr))", gap:12, marginTop:16 }}>
        {Object.entries(mastery).map(([k,v])=><div key={k} className="panel" data-testid={`mastery-${k}`} style={{ padding:14 }}><div className="mono muted" style={{fontSize:11, letterSpacing:"0.06em", textTransform:"uppercase"}}>{k}</div><div style={{fontFamily:"var(--font-display)", fontWeight:750, fontSize:18, marginTop:4}}>{LABELS[v as string] ?? v}</div><div style={{ height:4, background:"var(--border)", borderRadius:999, marginTop:8, overflow:"hidden" }}><div style={{ width: v==="solid" ? "100%" : v==="developing" ? "54%" : "12%", height:"100%", background: v==="solid" ? "var(--success)" : v==="developing" ? "var(--accent)" : "var(--border-strong)" }}/></div></div>)}
      </div>
      <div className="panel" style={{ marginTop:16, borderColor:"var(--accent)" }}><h3 style={{margin:0}}>Transferencia</h3><p className="muted" style={{fontSize:13}}>Has practicado decisiones con compromiso real. Sigue en Sandbox y retos 5 capturas — ahí se ve el ojo.</p></div>
    </div>
  );
}

import { useState } from "react";
import { useAppStore } from "../../app/appStore";
import { guidanceFromActions } from "./diagnostic";
export function Onboarding() {
  const navigate = useAppStore(s=>s.navigate);
  const [step,setStep]=useState<1|2|3>(1);
  const [choices,setChoices]=useState<Array<{shutterDenominator?:number; aperture?:number}>>([]);
  const [mode,setMode]=useState<string|null>(null);
  const pickShutter=(d:number)=>{ const n=[...choices,{shutterDenominator:d}]; setChoices(n); setStep(2); };
  const pickAperture=(a:number)=>{ const n=[...choices,{aperture:a}]; setChoices(n); const m=guidanceFromActions(n); setMode(m); try{localStorage.setItem("cameralab:v1:guidance",m);}catch{} setStep(3); };
  return (
    <div className="container section" style={{ maxWidth: 720 }}>
      <div className="pill" style={{ marginBottom: 12 }}>Onboarding · 2 gestos · 30s</div>
      {step===1 && <><h1>Hola — ¿cómo ves el movimiento?</h1><p className="muted">Elige obturación para congelar al corredor. No hay respuesta “correcta”, solo tu primera predicción.</p>
        <div style={{ display:"flex", gap:10, marginTop:18 }}>{[30,125,500].map(d=><button key={d} data-testid={`onboard-shutter-${d}`} onClick={()=>pickShutter(d)} className="mission-link" style={{ textAlign:"center", flex:1 }}>1/{d}<br/><span className="mono muted">{d===30?"lenta · rastro":d===500?"rápida · congela":"media"}</span></button>)}</div></>}
      {step===2 && <><h1>Y ahora, ¿cómo separas el fondo?</h1><p className="muted">Ajusta apertura. Abierta desenfoca, cerrada mantiene nítido.</p>
        <div style={{ display:"flex", gap:10, marginTop:18 }}>{[2,4,8].map(a=><button key={a} data-testid={`onboard-aperture-${a}`} onClick={()=>pickAperture(a)} className="mission-link" style={{ textAlign:"center", flex:1 }}>f/{a}<br/><span className="mono muted">{a===2?"muy abierta":a===8?"cerrada":"media"}</span></button>)}</div></>}
      {step===3 && <><h1>Listo ✦</h1><p className="muted">Modo de guía: <strong>{mode==="more"?"Más apoyo":"Estándar"}</strong> — cambia cuántas pistas se ofrecen, no qué aprendes.</p>
        <div className="panel" style={{ marginTop:14 }}><p style={{fontSize:13, margin:0}}>Has hecho 2 decisiones fotográficas. Ahora el currículo te espera — entra donde quieras.</p></div>
        <button data-testid="onboard-continue" onClick={()=>navigate("curriculum")} className="btn-primary" style={{ marginTop:16, width:"100%" }}>Ir al currículo →</button></>}
    </div>
  );
}

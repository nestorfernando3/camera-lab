import { useProgressStore } from "../progress/progressStore";
import { exportTelemetry, downloadTelemetry } from "../telemetry/exportTelemetry";
import { useState } from "react";
export function SettingsPanel(){
  const { reducedMotion, soundEnabled, locale, setReducedMotion, setSoundEnabled, setLocale, resetAll } = useProgressStore();
  const [presentation, setPresentation]=useState(()=>{ try{return localStorage.getItem("cameralab:v1:presentation")==="true";}catch{return false;}});
  const togglePres=(v:boolean)=>{ setPresentation(v); try{localStorage.setItem("cameralab:v1:presentation",String(v));}catch{} if(v) document.documentElement.style.fontSize="18px"; else document.documentElement.style.removeProperty("font-size"); };
  return (
    <div className="container section" data-testid="settings-panel" style={{ maxWidth:640 }}>
      <div className="pill" style={{marginBottom:12}}>Ajustes · local only</div>
      <h1 style={{margin:"0 0 8px"}}>Ajustes</h1>
      <p className="muted">Todo queda en tu navegador. Sin cuentas, sin nube.</p>
      <div style={{ display:"grid", gap:14, marginTop:18 }}>
        <label className="panel" style={{ display:"flex", justifyContent:"space-between", alignItems:"center", cursor:"pointer" }}><span><strong>Reducir movimiento</strong><br/><span className="mono muted">Quita animaciones y transiciones</span></span><input type="checkbox" checked={reducedMotion} onChange={e=>setReducedMotion(e.target.checked)} aria-label="Reducir movimiento" /></label>
        <label className="panel" style={{ display:"flex", justifyContent:"space-between", alignItems:"center", cursor:"pointer" }}><span><strong>Sonido obturación</strong><br/><span className="mono muted">Click sintetizado (Web Audio)</span></span><input type="checkbox" checked={soundEnabled} onChange={e=>setSoundEnabled(e.target.checked)} aria-label="Sonido obturador" /></label>
        <label className="panel" style={{ display:"flex", justifyContent:"space-between", alignItems:"center", cursor:"pointer" }}><span><strong>Modo presentación</strong><br/><span className="mono muted">Texto y controles más grandes</span></span><input type="checkbox" checked={presentation} onChange={e=>togglePres(e.target.checked)} aria-label="Modo presentación" /></label>
        <label className="panel">Idioma / Language<br/><select value={locale} onChange={e=>setLocale(e.target.value as "es"|"en")} aria-label="Idioma" style={{ marginTop:8, padding:8, borderRadius:8, border:"1px solid var(--border)", background:"var(--bg-soft)", color:"var(--fg)" }}><option value="es">Español</option><option value="en">English</option></select></label>
        <div className="panel"><button onClick={async()=>{ const b=await exportTelemetry(); downloadTelemetry(b); }} data-testid="export-telemetry" className="btn-ghost" style={{width:"100%"}}>⬇ Exportar datos de aprendizaje (JSON)</button><p className="mono muted" style={{fontSize:11, margin:"8px 0 0"}}>Se descarga un JSON local con eventos anónimos (settings, métricas, hints). Nunca se sube.</p></div>
        <div className="panel" style={{ borderColor:"color-mix(in oklch, var(--danger) 40%, var(--border))" }}><h4 style={{margin:"0 0 8px", color:"var(--danger)"}}>Zona de reinicio</h4><div style={{display:"flex", gap:8}}><button data-testid="reset-all" onClick={()=>{ if(confirm("¿Reiniciar todo CameraLab? Se borrará progreso local y telemetría.")) resetAll(); }} style={{ flex:1, padding:10, borderRadius:999, border:"1px solid var(--danger)", background:"transparent", color:"var(--danger)", fontWeight:700, cursor:"pointer" }}>Reiniciar todo</button><button onClick={()=>location.hash="#curriculum"} className="btn-ghost" style={{ flex:1 }}>Repetir actividad</button></div></div>
      </div>
    </div>
  );
}

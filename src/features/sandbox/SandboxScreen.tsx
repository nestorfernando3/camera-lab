import { useState } from "react";
import { PRESETS } from "../../content/presets";
import { SceneCanvas } from "../../scenes/SceneCanvas";
import type { CameraSettings } from "../../domain/camera/types";
const DEFAULT: CameraSettings = { aperture: 4, shutterDenominator: 125, iso: 200, focalLengthMm: 50, subjectDistanceM: 2, focusMode: "auto-subject", focusTargetId: "portrait-subject", panningEnabled: false };
export function SandboxScreen() {
  const [settings, setSettings] = useState<CameraSettings>(DEFAULT);
  const apply = (id:string) => { const p=PRESETS.find(x=>x.id===id); if(p) setSettings(s=>({...s, ...p.settings})); };
  return (
    <div className="container section">
      <div className="section__head"><div><h1 style={{margin:0}}>Sandbox</h1><p className="muted">Laboratorio libre — todos los controles, 5 presets que muestran cada parámetro cambiado al instante.</p></div><span className="pill">Modo creativo</span></div>
      <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:14 }}>
        {PRESETS.map(p=><button key={p.id} data-testid={`preset-${p.id}`} onClick={()=>apply(p.id)} className="seg-btn">{p.labelKey}</button>)}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1.6fr 0.9fr", gap:16 }}>
        <div className="lab__stage" style={{ height: 480 }}><SceneCanvas sceneId="portrait" settings={settings} sceneEv100={10} /></div>
        <div className="panel" data-testid="sandbox-settings" style={{ display:"flex", flexDirection:"column", gap:10 }}>
          <h3 style={{margin:0}}>Ajustes actuales</h3>
          <div className="mono" style={{ display:"grid", gap:6, fontSize:13 }}>
            <div className="compare__card">f/{settings.aperture} · 1/{settings.shutterDenominator} · ISO{settings.iso}</div>
            <div className="compare__card">{settings.focalLengthMm}mm · {settings.subjectDistanceM}m · {settings.panningEnabled ? "panning ON" : "panning OFF"}</div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginTop:8 }}>
            <button className="seg-btn" onClick={()=>setSettings(s=>({...s, aperture: Math.max(1.4, s.aperture/1.4) as never}))}>Abrir</button>
            <button className="seg-btn" onClick={()=>setSettings(s=>({...s, aperture: Math.min(16, s.aperture*1.4) as never}))}>Cerrar</button>
          </div>
          <button data-testid="sandbox-capture" className="btn-primary" style={{ marginTop:6 }}>● Capturar en sandbox</button>
          <p className="mono muted" style={{ fontSize:11 }}>Los presets aquí nunca resuelven misiones — solo inspiran.</p>
        </div>
      </div>
    </div>
  );
}

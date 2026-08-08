import type { CaptureAttempt } from "../lab/labStore";
export function ModuleSummary({ captures, moduleId }: { captures: CaptureAttempt[]; moduleId: string }) {
  if (captures.length < 2) return <div className="panel" data-testid="module-summary"><h4 style={{margin:0}}>Resumen — {moduleId}</h4><p className="mono muted" style={{fontSize:12}}>Necesitas 2 capturas para ver tu progreso.</p></div>;
  const first=captures[0], last=captures[captures.length-1];
  const deltaMotion=first.metrics.motionBlurPx-last.metrics.motionBlurPx;
  const deltaBlur=last.metrics.backgroundBlurPx-first.metrics.backgroundBlurPx;
  return (
    <div className="panel" data-testid="module-summary">
      <h4 style={{margin:"0 0 8px"}}>Resumen — {moduleId}</h4>
      <p style={{fontSize:13, margin:0}}>{deltaMotion>0 ? `Reduciste el movimiento de ${first.metrics.motionBlurPx.toFixed(1)}px a ${last.metrics.motionBlurPx.toFixed(1)}px.` : `Tu movimiento pasó de ${first.metrics.motionBlurPx.toFixed(1)}px a ${last.metrics.motionBlurPx.toFixed(1)}px.`}</p>
      <p className="mono muted" style={{fontSize:11, margin:"8px 0 0"}}>Fondo {first.metrics.backgroundBlurPx.toFixed(1)}→{last.metrics.backgroundBlurPx.toFixed(1)}px ({deltaBlur>0?"más borroso":"más nítido"}) · Ruido {last.metrics.noiseStrength.toFixed(2)}</p>
    </div>
  );
}

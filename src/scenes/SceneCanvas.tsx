import { Canvas } from "@react-three/fiber";
import { Environment } from "./shared/Environment";
import { PedagogicalCamera } from "./shared/PedagogicalCamera";
import { PortraitScene } from "./portrait/PortraitScene";
import { RunnerScene } from "./runner/RunnerScene";
import { DepthScene } from "./depth/DepthScene";
import { SCENES } from "./sceneRegistry";
import { simulateCapture } from "../domain/camera/simulate";
import type { CameraSettings } from "../domain/camera/types";

function SceneForId({ id, reducedMotion }: { id: string; reducedMotion?: boolean }) {
  if (id === "runner") return <RunnerScene backgroundDistanceM={SCENES.runner.backgroundDistanceM} reducedMotion={reducedMotion} />;
  if (id === "depth") return <DepthScene backgroundDistanceM={SCENES.depth.backgroundDistanceM} />;
  return <PortraitScene backgroundDistanceM={SCENES.portrait.backgroundDistanceM} />;
}

export function SceneCanvas({
  sceneId,
  settings,
  sceneEv100,
  reducedMotion = false,
}: {
  sceneId: "runner" | "portrait" | "depth";
  settings: CameraSettings;
  sceneEv100: number;
  reducedMotion?: boolean;
}) {
  const sceneConfig = SCENES[sceneId];
  const snapshot = simulateCapture(settings, {
    ev100: sceneEv100,
    renderWidthPx: 1280,
    foregroundDistanceM: 1,
    backgroundDistanceM: sceneConfig.backgroundDistanceM,
    focusDistanceM: settings.subjectDistanceM,
    subjectSpeedMps: sceneId === "runner" ? 4 : 0,
  });

  const fov = snapshot.optics.horizontalFovDeg;
  const exposure = snapshot.exposure.exposureMultiplier;
  const noise = snapshot.effects.noiseStrength;

  // Map exposure to canvas background brightness
  const bgIntensity = Math.min(1, Math.max(0.2, exposure * 0.5));

  return (
    <div style={{ position: "relative", width: "100%", height: "400px", background: `rgb(${20 * bgIntensity}, ${20 * bgIntensity}, ${20 * bgIntensity})` }} data-testid="scene-canvas">
      {/* Hidden metrics for E2E */}
      <div
        data-testid="render-metrics"
        data-motion-blur={snapshot.metrics.motionBlurPx}
        data-background-blur={snapshot.metrics.backgroundBlurPx}
        data-noise={snapshot.metrics.noiseStrength}
        data-exposure-delta={snapshot.metrics.exposureDeltaAbs}
        data-fov={snapshot.metrics.horizontalFovDeg}
        hidden
      />
      {/* Textual description for a11y */}
      <p style={{ position: "absolute", left: "-9999px" }} aria-live="polite">
        Escena {sceneId}, apertura f/{settings.aperture}, obturador 1/{settings.shutterDenominator}, ISO {settings.iso}, focal {settings.focalLengthMm}mm, distancia {settings.subjectDistanceM}m. desenfoque movimiento {snapshot.metrics.motionBlurPx.toFixed(1)}px fondo blur {snapshot.metrics.backgroundBlurPx.toFixed(1)}px
      </p>

      <Canvas gl={{ preserveDrawingBuffer: true }} camera={{ position: [0, 1.6, 6], fov: 50 }}>
        <PedagogicalCamera fovDeg={fov} subjectDistanceM={settings.subjectDistanceM} />
        <SceneForId id={sceneId} reducedMotion={reducedMotion} />
        {/* Fallback environment if scene fails */}
        <Environment backgroundDistance={sceneConfig.backgroundDistanceM} />
      </Canvas>

      {/* Overlays */}
      {noise > 0.05 && (
        <div
          data-testid="noise-overlay"
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            opacity: noise * 0.4,
            background: "radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)",
            backgroundSize: "3px 3px",
          }}
        />
      )}
      {/* Motion trail visual */}
      {snapshot.metrics.motionBlurPx > 2 && sceneId === "runner" && (
        <div
          data-testid="motion-trail"
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: `${Math.min(80, snapshot.metrics.motionBlurPx * 0.6)}px`,
            height: "4px",
            background: "rgba(255,255,255,0.3)",
            transform: "translate(-50%, -50%)",
            filter: "blur(1px)",
          }}
        />
      )}
    </div>
  );
}

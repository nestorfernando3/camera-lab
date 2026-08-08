import { SENSOR_HEIGHT_MM, SENSOR_WIDTH_MM } from "./constants";
import { evaluateExposure } from "./exposure";
import { blurCirclePx, fieldOfViewDeg } from "./optics";
import { motionBlurPx } from "./motion";
import { imageEffects } from "./imageEffects";
import type { CameraSettings, ExposureResult, ImageEffectResult, MotionResult, OpticsResult } from "./types";

export interface SimulationSceneInput {
  ev100: number;
  renderWidthPx: number;
  foregroundDistanceM: number;
  backgroundDistanceM: number;
  focusDistanceM: number;
  subjectSpeedMps: number;
}

export interface SimulationSnapshot {
  exposure: ExposureResult;
  optics: OpticsResult;
  motion: MotionResult;
  effects: ImageEffectResult;
  metrics: {
    exposureDeltaAbs: number;
    motionBlurPx: number;
    backgroundMotionBlurPx: number;
    foregroundBlurPx: number;
    backgroundBlurPx: number;
    noiseStrength: number;
    highlightClippingRisk: number;
    shadowLossRisk: number;
    horizontalFovDeg: number;
    framingScale: number;
  };
}

export function simulateCapture(
  settings: CameraSettings,
  scene: SimulationSceneInput
): SimulationSnapshot {
  const exposure = evaluateExposure(settings, { ev100: scene.ev100 });

  const horizontalFovDeg = fieldOfViewDeg(settings.focalLengthMm, SENSOR_WIDTH_MM);
  const verticalFovDeg = fieldOfViewDeg(settings.focalLengthMm, SENSOR_HEIGHT_MM);

  const foregroundBlurPx = blurCirclePx({
    focalLengthMm: settings.focalLengthMm,
    aperture: settings.aperture,
    focusDistanceM: scene.focusDistanceM,
    objectDistanceM: scene.foregroundDistanceM,
    renderWidthPx: scene.renderWidthPx,
  });

  const backgroundBlurPx = blurCirclePx({
    focalLengthMm: settings.focalLengthMm,
    aperture: settings.aperture,
    focusDistanceM: scene.focusDistanceM,
    objectDistanceM: scene.backgroundDistanceM,
    renderWidthPx: scene.renderWidthPx,
  });

  const baseMotionBlur = motionBlurPx({
    speedMps: scene.subjectSpeedMps,
    subjectDistanceM: settings.subjectDistanceM,
    shutterSeconds: 1 / settings.shutterDenominator,
    focalLengthMm: settings.focalLengthMm,
    renderWidthPx: scene.renderWidthPx,
  });

  let blurPx: number;
  let backgroundMotionBlurPx: number;
  if (settings.panningEnabled) {
    blurPx = baseMotionBlur * 0.2;
    backgroundMotionBlurPx = baseMotionBlur * 0.8;
  } else {
    blurPx = baseMotionBlur;
    backgroundMotionBlurPx = 0;
  }

  const motion: MotionResult = {
    blurPx,
    normalizedBlur: Math.min(1, blurPx / 50),
    direction: [1, 0],
  };

  const effects = imageEffects(settings, exposure);

  const optics: OpticsResult = {
    verticalFovDeg,
    horizontalFovDeg,
    focusDistanceM: scene.focusDistanceM,
    foregroundBlurPx,
    backgroundBlurPx,
  };

  const framingScale = settings.focalLengthMm / settings.subjectDistanceM;

  return {
    exposure,
    optics,
    motion,
    effects,
    metrics: {
      exposureDeltaAbs: Math.abs(exposure.deltaStops),
      motionBlurPx: blurPx,
      backgroundMotionBlurPx,
      foregroundBlurPx,
      backgroundBlurPx,
      noiseStrength: effects.noiseStrength,
      highlightClippingRisk: exposure.highlightClippingRisk,
      shadowLossRisk: exposure.shadowLossRisk,
      horizontalFovDeg,
      framingScale,
    },
  };
}

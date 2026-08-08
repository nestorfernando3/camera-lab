import type { CameraSettings, ExposureResult, SceneExposure, ShutterDenominator } from "./types";

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

export function shutterSeconds(denominator: ShutterDenominator): number {
  return 1 / denominator;
}

export function cameraEv100(settings: CameraSettings): number {
  const shutter = shutterSeconds(settings.shutterDenominator);
  return Math.log2((settings.aperture ** 2) / shutter) - Math.log2(settings.iso / 100);
}

export function evaluateExposure(
  settings: CameraSettings,
  scene: SceneExposure
): ExposureResult {
  const camEv = cameraEv100(settings);
  const deltaStops = scene.ev100 - camEv;
  const rawMultiplier = 2 ** deltaStops;
  const exposureMultiplier = Math.min(8, Math.max(0.125, rawMultiplier));
  const highlightClippingRisk = clamp01((deltaStops - 0.5) / 2.5);
  const shadowLossRisk = clamp01((-deltaStops - 0.5) / 2.5);
  return {
    cameraEv100: camEv,
    deltaStops,
    exposureMultiplier,
    highlightClippingRisk,
    shadowLossRisk,
  };
}

export function stopDifference(a: number, b: number): number {
  return Math.abs(a - b);
}

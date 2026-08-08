import type { CameraSettings, ExposureResult, ImageEffectResult, ISO } from "./types";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export function noiseStrengthForIso(iso: ISO): number {
  const isoStops = Math.log2(iso / 100);
  return clamp01(isoStops / 5);
}

export function imageEffects(
  settings: CameraSettings,
  exposure: ExposureResult
): ImageEffectResult {
  const noiseStrength = noiseStrengthForIso(settings.iso);
  return {
    noiseStrength,
    clipping: {
      highlights: exposure.highlightClippingRisk,
      shadows: exposure.shadowLossRisk,
    },
  };
}

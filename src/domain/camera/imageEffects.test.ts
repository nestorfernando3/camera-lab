import { describe, expect, it } from "vitest";
import { imageEffects, noiseStrengthForIso } from "./imageEffects";
import { evaluateExposure } from "./exposure";
import type { CameraSettings } from "./types";

describe("imageEffects", () => {
  it("noise strength is 0 at ISO 100 and 1 at 3200", () => {
    expect(noiseStrengthForIso(100)).toBe(0);
    expect(noiseStrengthForIso(3200)).toBe(1);
  });

  it("higher ISO gives more noise", () => {
    expect(noiseStrengthForIso(1600)).toBeGreaterThan(noiseStrengthForIso(400));
  });

  it("positive delta raises highlight clipping", () => {
    const s: CameraSettings = {
      aperture: 8,
      shutterDenominator: 125,
      iso: 100,
      focalLengthMm: 50,
      subjectDistanceM: 2,
      focusMode: "auto-subject",
      focusTargetId: "subject",
      panningEnabled: false,
    };
    const camEv = Math.log2((8 ** 2) / (1 / 125)) - Math.log2(100 / 100);
    const exposure = evaluateExposure(s, { ev100: camEv + 2 });
    const effects = imageEffects(s, exposure);
    expect(effects.clipping.highlights).toBeGreaterThan(0);
  });
});

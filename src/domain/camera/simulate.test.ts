import { describe, expect, it } from "vitest";
import { simulateCapture } from "./simulate";
import type { CameraSettings } from "./types";

const baseSettings: CameraSettings = {
  aperture: 4,
  shutterDenominator: 125,
  iso: 400,
  focalLengthMm: 50,
  subjectDistanceM: 2,
  focusMode: "auto-subject",
  focusTargetId: "subject",
  panningEnabled: false,
};

const baseScene = {
  ev100: 11,
  renderWidthPx: 1280,
  foregroundDistanceM: 1,
  backgroundDistanceM: 10,
  focusDistanceM: 2,
  subjectSpeedMps: 4,
};

describe("simulateCapture", () => {
  it("exposes all mission metrics", () => {
    const snapshot = simulateCapture(baseSettings, baseScene);
    expect(snapshot.metrics.exposureDeltaAbs).toBe(Math.abs(snapshot.exposure.deltaStops));
    expect(snapshot.metrics.framingScale).toBeCloseTo(
      baseSettings.focalLengthMm / baseSettings.subjectDistanceM,
      6
    );
  });

  it("backgroundMotionBlurPx is 0 without panning", () => {
    const snapshot = simulateCapture({ ...baseSettings, panningEnabled: false }, baseScene);
    expect(snapshot.metrics.backgroundMotionBlurPx).toBe(0);
  });

  it("with panning uses 0.8/0.2 ratio", () => {
    const without = simulateCapture({ ...baseSettings, panningEnabled: false }, baseScene);
    const withPanning = simulateCapture({ ...baseSettings, panningEnabled: true }, baseScene);
    const baseMotion = without.metrics.motionBlurPx;
    expect(withPanning.metrics.motionBlurPx).toBeCloseTo(baseMotion * 0.2, 5);
    expect(withPanning.metrics.backgroundMotionBlurPx).toBeCloseTo(baseMotion * 0.8, 5);
  });
});

import { describe, expect, it } from "vitest";
import { cameraEv100, evaluateExposure } from "./exposure";
import type { CameraSettings } from "./types";

function settings(overrides: Partial<CameraSettings> = {}): CameraSettings {
  return {
    aperture: 8,
    shutterDenominator: 125,
    iso: 100,
    focalLengthMm: 50,
    subjectDistanceM: 2,
    focusMode: "auto-subject",
    focusTargetId: "portrait-subject",
    panningEnabled: false,
    ...overrides,
  };
}

describe("exposure", () => {
  it("treats f/16 1/125 ISO100 as approximately EV15", () => {
    expect(cameraEv100(settings({ aperture: 16, shutterDenominator: 125, iso: 100 }))).toBeCloseTo(
      15,
      1
    );
  });

  it("increasing ISO 100 to 200 changes camera EV100 by one stop", () => {
    const a = cameraEv100(settings({ iso: 100 }));
    const b = cameraEv100(settings({ iso: 200 }));
    expect(a - b).toBeCloseTo(1, 5);
  });

  it("returns zero delta when scene and camera EV match", () => {
    const s = settings({ aperture: 16, shutterDenominator: 125, iso: 100 });
    const scene = { ev100: cameraEv100(s) };
    expect(evaluateExposure(s, scene).deltaStops).toBeCloseTo(0, 5);
  });

  it("positive delta increases highlight risk", () => {
    const s = settings({ aperture: 16, shutterDenominator: 125, iso: 100 });
    const over = evaluateExposure(s, { ev100: cameraEv100(s) + 2 });
    const under = evaluateExposure(s, { ev100: cameraEv100(s) - 2 });
    expect(over.highlightClippingRisk).toBeGreaterThan(0);
    expect(over.shadowLossRisk).toBe(0);
    expect(under.shadowLossRisk).toBeGreaterThan(0);
    expect(under.highlightClippingRisk).toBe(0);
  });

  it("clamps exposure multiplier to [0.125,8]", () => {
    const s = settings({ aperture: 1.4, shutterDenominator: 2000, iso: 100 });
    const bright = evaluateExposure(s, { ev100: cameraEv100(s) + 5 });
    const dark = evaluateExposure(s, { ev100: cameraEv100(s) - 5 });
    expect(bright.exposureMultiplier).toBe(8);
    expect(dark.exposureMultiplier).toBe(0.125);
  });
});

import { describe, expect, it } from "vitest";
import { motionBlurPx } from "./motion";

describe("motion", () => {
  it("slower shutter gives more blur", () => {
    const base = {
      speedMps: 4,
      subjectDistanceM: 4,
      focalLengthMm: 50,
      renderWidthPx: 1280,
    };
    expect(
      motionBlurPx({ ...base, shutterSeconds: 1 / 30 })
    ).toBeGreaterThan(motionBlurPx({ ...base, shutterSeconds: 1 / 500 }));
  });

  it("longer focal length gives more blur", () => {
    const base = {
      speedMps: 4,
      subjectDistanceM: 4,
      shutterSeconds: 1 / 125,
      renderWidthPx: 1280,
    };
    expect(
      motionBlurPx({ ...base, focalLengthMm: 135 })
    ).toBeGreaterThan(motionBlurPx({ ...base, focalLengthMm: 24 }));
  });

  it("closer distance gives more blur", () => {
    const base = {
      speedMps: 4,
      shutterSeconds: 1 / 125,
      focalLengthMm: 50,
      renderWidthPx: 1280,
    };
    expect(
      motionBlurPx({ ...base, subjectDistanceM: 2 })
    ).toBeGreaterThan(motionBlurPx({ ...base, subjectDistanceM: 8 }));
  });

  it("higher speed gives more blur", () => {
    const base = {
      subjectDistanceM: 4,
      shutterSeconds: 1 / 125,
      focalLengthMm: 50,
      renderWidthPx: 1280,
    };
    expect(motionBlurPx({ ...base, speedMps: 6 })).toBeGreaterThan(
      motionBlurPx({ ...base, speedMps: 2 })
    );
  });
});

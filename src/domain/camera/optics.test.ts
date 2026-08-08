import { describe, expect, it } from "vitest";
import { blurCirclePx, fieldOfViewDeg } from "./optics";

describe("optics", () => {
  it("shorter focal length gives larger FOV", () => {
    expect(fieldOfViewDeg(24, 36)).toBeGreaterThan(fieldOfViewDeg(85, 36));
  });

  it("wider aperture gives more blur", () => {
    const base = {
      focalLengthMm: 50,
      focusDistanceM: 2,
      objectDistanceM: 4,
      renderWidthPx: 1280,
    };
    expect(blurCirclePx({ ...base, aperture: 2 })).toBeGreaterThan(
      blurCirclePx({ ...base, aperture: 8 })
    );
  });

  it("object at focus distance gives ~0 blur", () => {
    const blur = blurCirclePx({
      focalLengthMm: 50,
      aperture: 2,
      focusDistanceM: 2,
      objectDistanceM: 2,
      renderWidthPx: 1280,
    });
    expect(blur).toBeCloseTo(0, 5);
  });

  it("longer focal length increases blur at fixed position", () => {
    const base = {
      aperture: 2.8,
      focusDistanceM: 2,
      objectDistanceM: 4,
      renderWidthPx: 1280,
    };
    expect(
      blurCirclePx({ ...base, focalLengthMm: 85 })
    ).toBeGreaterThan(blurCirclePx({ ...base, focalLengthMm: 35 }));
  });
});

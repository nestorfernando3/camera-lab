import { describe, expect, it } from "vitest";
import {
  APERTURES,
  FOCAL_LENGTHS,
  ISO_VALUES,
  SHUTTER_DENOMINATORS,
} from "./constants";

describe("camera constants", () => {
  it("uses the approved full-stop values", () => {
    expect(APERTURES).toEqual([1.4, 2, 2.8, 4, 5.6, 8, 11, 16]);
    expect(SHUTTER_DENOMINATORS).toEqual([15, 30, 60, 125, 250, 500, 1000, 2000]);
    expect(ISO_VALUES).toEqual([100, 200, 400, 800, 1600, 3200]);
    expect(FOCAL_LENGTHS).toEqual([24, 35, 50, 85, 135]);
  });
});

import { describe, expect, it } from "vitest";
import { SCENES } from "./sceneRegistry";

describe("sceneRegistry", () => {
  it("has three scenes", () => {
    expect(Object.keys(SCENES)).toEqual(expect.arrayContaining(["runner", "portrait", "depth"]));
  });
  it("runner has correct defaults", () => {
    expect(SCENES.runner.defaultEv100).toBe(11);
    expect(SCENES.runner.backgroundDistanceM).toBe(12);
  });
  it("portrait has correct background", () => {
    expect(SCENES.portrait.backgroundDistanceM).toBe(10);
  });
  it("depth has multiple focus targets", () => {
    expect(SCENES.depth.focusTargets.length).toBeGreaterThan(2);
  });
});

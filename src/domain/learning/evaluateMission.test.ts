import { describe, expect, it } from "vitest";
import { evaluateMission } from "./evaluateMission";
import { MISSIONS } from "../../content/missions";
import type { CaptureSnapshot, MissionDefinition } from "./types";

function snap(metrics: Partial<CaptureSnapshot["metrics"]>, settingsOverrides: Partial<CaptureSnapshot["settings"]> = {}): CaptureSnapshot {
  return {
    settings: {
      aperture: 4,
      shutterDenominator: 125,
      iso: 100,
      focalLengthMm: 50,
      subjectDistanceM: 2,
      focusMode: "auto-subject",
      focusTargetId: "subject",
      panningEnabled: false,
      ...settingsOverrides,
    },
    metrics: {
      exposureDeltaAbs: 0,
      motionBlurPx: 0,
      backgroundMotionBlurPx: 0,
      foregroundBlurPx: 0,
      backgroundBlurPx: 0,
      noiseStrength: 0,
      highlightClippingRisk: 0,
      shadowLossRisk: 0,
      horizontalFovDeg: 40,
      framingScale: 25,
      ...metrics,
    },
  };
}

describe("evaluateMission", () => {
  it("single metric pass/fail", () => {
    const mission: MissionDefinition = {
      id: "test-metric",
      moduleId: "m1",
      sceneId: "runner",
      titleKey: "t",
      briefKey: "b",
      intentKey: "i",
      enabledControls: ["shutter"],
      initialSettings: snap({}).settings,
      sceneEv100: 10,
      rules: [{ kind: "metric", metric: "motionBlurPx", operator: "<=", value: 4, weight: 1 }],
      hintKeys: ["h1", "h2", "h3"],
      maxVisibleCaptures: 1,
      concepts: ["shutter"],
    };
    expect(evaluateMission({ mission, captures: [snap({ motionBlurPx: 3 })] }).passed).toBe(true);
    expect(evaluateMission({ mission, captures: [snap({ motionBlurPx: 5 })] }).passed).toBe(false);
  });

  it("two captures with equivalent exposure but motion-blur delta >=6 px", () => {
    const mission: MissionDefinition = {
      id: "same-exp",
      moduleId: "m4",
      sceneId: "runner",
      titleKey: "t",
      briefKey: "b",
      intentKey: "i",
      enabledControls: ["aperture", "shutter", "iso"],
      initialSettings: snap({}).settings,
      sceneEv100: 10,
      rules: [
        { kind: "all-retained-captures-metric", metric: "exposureDeltaAbs", operator: "<=", value: 0.5, minCaptures: 2, weight: 0.5 },
        { kind: "pair-metric-delta", metric: "motionBlurPx", operator: ">=", value: 6, weight: 0.5 },
      ],
      hintKeys: ["h1", "h2", "h3"],
      maxVisibleCaptures: 2,
      concepts: ["stops"],
    };
    const a = snap({ exposureDeltaAbs: 0.2, motionBlurPx: 10 });
    const b = snap({ exposureDeltaAbs: 0.3, motionBlurPx: 2 });
    expect(evaluateMission({ mission, captures: [a, b] }).passed).toBe(true);
    const c = snap({ exposureDeltaAbs: 0.2, motionBlurPx: 5 });
    const d = snap({ exposureDeltaAbs: 0.3, motionBlurPx: 4 });
    expect(evaluateMission({ mission, captures: [c, d] }).passed).toBe(false);
  });

  it("aperture changed by at least two approved full-stop positions", () => {
    const mission: MissionDefinition = {
      id: "one-stop",
      moduleId: "m4",
      sceneId: "portrait",
      titleKey: "t",
      briefKey: "b",
      intentKey: "i",
      enabledControls: ["aperture", "shutter"],
      initialSettings: snap({}).settings,
      sceneEv100: 10,
      rules: [
        { kind: "metric", metric: "exposureDeltaAbs", operator: "<=", value: 0.5, weight: 0.6 },
        { kind: "setting-stop-delta", setting: "aperture", minStops: 2, weight: 0.4 },
      ],
      hintKeys: ["h1", "h2", "h3"],
      maxVisibleCaptures: 2,
      concepts: ["stops"],
    };
    const a = snap({ exposureDeltaAbs: 0.2 }, { aperture: 4 });
    const b = snap({ exposureDeltaAbs: 0.2 }, { aperture: 8 }); // 4 -> 8 is 2 stops (4,5.6,8)
    expect(evaluateMission({ mission, captures: [a, b] }).passed).toBe(true);
    const c = snap({ exposureDeltaAbs: 0.2 }, { aperture: 4 });
    const d = snap({ exposureDeltaAbs: 0.2 }, { aperture: 5.6 }); // only 1 stop
    expect(evaluateMission({ mission, captures: [c, d] }).passed).toBe(false);
  });

  it("two distinct focal lengths", () => {
    const mission: MissionDefinition = {
      id: "distinct-focal",
      moduleId: "m5",
      sceneId: "portrait",
      titleKey: "t",
      briefKey: "b",
      intentKey: "i",
      enabledControls: ["focalLength"],
      initialSettings: snap({}).settings,
      sceneEv100: 10,
      rules: [{ kind: "distinct-setting-count", setting: "focalLengthMm", minDistinct: 2, weight: 1 }],
      hintKeys: ["h1", "h2", "h3"],
      maxVisibleCaptures: 2,
      concepts: ["focal-length"],
    };
    const a = snap({}, { focalLengthMm: 35 });
    const b = snap({}, { focalLengthMm: 85 });
    expect(evaluateMission({ mission, captures: [a, b] }).passed).toBe(true);
    const c = snap({}, { focalLengthMm: 50 });
    const d = snap({}, { focalLengthMm: 50 });
    expect(evaluateMission({ mission, captures: [c, d] }).passed).toBe(false);
  });

  it("framing relative difference <=0.15", () => {
    const mission: MissionDefinition = {
      id: "framing",
      moduleId: "m5",
      sceneId: "portrait",
      titleKey: "t",
      briefKey: "b",
      intentKey: "i",
      enabledControls: ["focalLength", "subjectDistance"],
      initialSettings: snap({}).settings,
      sceneEv100: 10,
      rules: [{ kind: "framing-similarity", maxRelativeDifference: 0.15, minCaptures: 2, weight: 1 }],
      hintKeys: ["h1", "h2", "h3"],
      maxVisibleCaptures: 3,
      concepts: ["focal-length"],
    };
    // framingScale = focal / distance
    const a = snap({ framingScale: 25 }); // 50/2
    const b = snap({ framingScale: 26 }); // ~50/1.9 => diff 0.04 avg 25.5 => 0.039 <0.15 => pass
    expect(evaluateMission({ mission, captures: [a, b] }).passed).toBe(true);
    const c = snap({ framingScale: 25 });
    const d = snap({ framingScale: 35 }); // diff 10 avg30 => 0.33 >0.15
    expect(evaluateMission({ mission, captures: [c, d] }).passed).toBe(false);
  });

  it("exposes no numeric grade/score field", () => {
    const mission = MISSIONS[0];
    const result = evaluateMission({ mission, captures: [snap({ motionBlurPx: 1 })] });
    expect(result).not.toHaveProperty("score");
    expect(result).not.toHaveProperty("grade");
    expect(result).not.toHaveProperty("points");
  });

  it("missions have length 15 and unique ids and panning false", () => {
    expect(MISSIONS).toHaveLength(15);
    expect(new Set(MISSIONS.map((m) => m.id)).size).toBe(15);
    expect(MISSIONS.every((m) => m.rules.length > 0)).toBe(true);
    expect(MISSIONS.every((m) => m.initialSettings.panningEnabled === false)).toBe(true);
  });
});

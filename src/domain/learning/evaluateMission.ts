import { APERTURES, ISO_VALUES, SHUTTER_DENOMINATORS } from "../camera/constants";
import type { CaptureSnapshot, MissionDefinition, MissionEvaluation, RuleEvaluation } from "./types";

function compare(operator: "<=" | ">=", actual: number, expected: number): boolean {
  return operator === "<=" ? actual <= expected + 1e-9 : actual >= expected - 1e-9;
}

function stopIndex(setting: "aperture" | "shutterDenominator" | "iso", value: number): number {
  if (setting === "aperture") return APERTURES.indexOf(value as never);
  if (setting === "shutterDenominator") return SHUTTER_DENOMINATORS.indexOf(value as never);
  return ISO_VALUES.indexOf(value as never);
}

export function evaluateMission(args: {
  mission: MissionDefinition;
  captures: CaptureSnapshot[];
}): MissionEvaluation {
  const { mission, captures } = args;
  const ruleResults: RuleEvaluation[] = [];
  let allWeightPass = true;

  for (let i = 0; i < mission.rules.length; i++) {
    const rule = mission.rules[i];
    let actual: number | number[] = 0;
    let passed = false;

    switch (rule.kind) {
      case "metric": {
        const latest = captures[captures.length - 1];
        actual = latest ? (latest.metrics[rule.metric] ?? 0) : Number.POSITIVE_INFINITY;
        if (typeof actual === "number") passed = compare(rule.operator, actual, rule.value);
        break;
      }
      case "all-retained-captures-metric": {
        const values = captures.map((c) => c.metrics[rule.metric] ?? 0);
        actual = values;
        if (captures.length < rule.minCaptures) {
          passed = false;
        } else {
          passed = values.every((v) => compare(rule.operator, v, rule.value));
        }
        break;
      }
      case "pair-metric-delta": {
        if (captures.length < 2) {
          actual = 0;
          passed = false;
        } else {
          const a = captures[captures.length - 2].metrics[rule.metric] ?? 0;
          const b = captures[captures.length - 1].metrics[rule.metric] ?? 0;
          const delta = Math.abs(a - b);
          actual = delta;
          passed = compare(rule.operator, delta, rule.value);
        }
        break;
      }
      case "setting-stop-delta": {
        if (captures.length < 2) {
          actual = 0;
          passed = false;
        } else {
          const a = captures[captures.length - 2].settings[rule.setting] as number;
          const b = captures[captures.length - 1].settings[rule.setting] as number;
          const ia = stopIndex(rule.setting, a);
          const ib = stopIndex(rule.setting, b);
          const stops = Math.abs(ia - ib);
          actual = stops;
          passed = stops >= rule.minStops;
        }
        break;
      }
      case "distinct-setting-count": {
        const distinct = new Set(captures.map((c) => c.settings[rule.setting] as unknown as string)).size;
        actual = distinct;
        passed = distinct >= rule.minDistinct;
        break;
      }
      case "framing-similarity": {
        if (captures.length < rule.minCaptures) {
          actual = Number.POSITIVE_INFINITY;
          passed = false;
        } else {
          const a = captures[captures.length - 2].metrics.framingScale ?? 0;
          const b = captures[captures.length - 1].metrics.framingScale ?? 0;
          const avg = (a + b) / 2;
          const rel = avg === 0 ? Number.POSITIVE_INFINITY : Math.abs(a - b) / avg;
          actual = rel;
          passed = rel <= rule.maxRelativeDifference + 1e-9;
        }
        break;
      }
    }

    const weight = (rule as { weight: number }).weight;
    ruleResults.push({ ruleIndex: i, actual, passed, weight });
    if (weight > 0 && !passed) allWeightPass = false;
  }

  const passed = captures.length > 0 && allWeightPass;
  const strengths: string[] = [];
  const tradeOffs: string[] = [];

  if (passed) {
    strengths.push("mission.passed");
  }

  // tradeOffs are pedagogical - we don't generate scores, just placeholder
  if (captures.length > 0) {
    const last = captures[captures.length - 1];
    if (last.metrics.noiseStrength > 0.6) tradeOffs.push("tradeoff.noise");
    if (last.metrics.motionBlurPx > 6) tradeOffs.push("tradeoff.motion");
    if (last.metrics.backgroundBlurPx < 4) tradeOffs.push("tradeoff.dof-low");
    if (last.metrics.backgroundBlurPx > 6) tradeOffs.push("tradeoff.dof-high");
  }

  return {
    passed,
    ruleResults,
    strengths,
    tradeOffs,
    nextHintKey: passed ? undefined : mission.hintKeys[0],
  };
}

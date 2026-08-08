import type { CameraSettings } from "../camera/types";

export type MasteryLevel = "unexplored" | "developing" | "solid";
export type MissionPhase =
  | "brief"
  | "predict-by-action"
  | "explore"
  | "capture"
  | "feedback"
  | "complete";

export type MetricName =
  | "exposureDeltaAbs"
  | "motionBlurPx"
  | "backgroundMotionBlurPx"
  | "foregroundBlurPx"
  | "backgroundBlurPx"
  | "noiseStrength"
  | "highlightClippingRisk"
  | "shadowLossRisk"
  | "horizontalFovDeg"
  | "framingScale";

export interface CaptureSnapshot {
  settings: CameraSettings;
  metrics: Record<MetricName, number>;
}

export type CameraSettingName =
  | "aperture"
  | "shutterDenominator"
  | "iso"
  | "focalLengthMm"
  | "subjectDistanceM";

export type MissionRule =
  | {
      kind: "metric";
      metric: MetricName;
      operator: "<=" | ">=";
      value: number;
      weight: number;
    }
  | {
      kind: "all-retained-captures-metric";
      metric: MetricName;
      operator: "<=" | ">=";
      value: number;
      minCaptures: number;
      weight: number;
    }
  | {
      kind: "pair-metric-delta";
      metric: MetricName;
      operator: "<=" | ">=";
      value: number;
      weight: number;
    }
  | {
      kind: "setting-stop-delta";
      setting: "aperture" | "shutterDenominator" | "iso";
      minStops: number;
      weight: number;
    }
  | {
      kind: "distinct-setting-count";
      setting: CameraSettingName;
      minDistinct: number;
      weight: number;
    }
  | {
      kind: "framing-similarity";
      maxRelativeDifference: number;
      minCaptures: 2;
      weight: number;
    };

export interface MissionDefinition {
  id: string;
  moduleId: string;
  sceneId: "runner" | "portrait" | "depth";
  titleKey: string;
  briefKey: string;
  intentKey: string;
  enabledControls: Array<
    | "aperture"
    | "shutter"
    | "iso"
    | "focalLength"
    | "subjectDistance"
    | "focusTarget"
    | "panning"
  >;
  initialSettings: CameraSettings;
  sceneEv100: number;
  rules: MissionRule[];
  hintKeys: [string, string, string];
  maxVisibleCaptures: 1 | 2 | 3 | 5;
  concepts: Array<
    "shutter" | "aperture" | "iso" | "stops" | "focal-length" | "distance" | "focus" | "trade-offs"
  >;
}

export interface RuleEvaluation {
  ruleIndex: number;
  actual: number | number[];
  passed: boolean;
  weight: number;
}

export interface MissionEvaluation {
  passed: boolean;
  ruleResults: RuleEvaluation[];
  strengths: string[];
  tradeOffs: string[];
  nextHintKey?: string;
}

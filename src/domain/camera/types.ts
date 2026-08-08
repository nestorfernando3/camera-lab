export type Aperture = 1.4 | 2 | 2.8 | 4 | 5.6 | 8 | 11 | 16;
export type ShutterDenominator = 15 | 30 | 60 | 125 | 250 | 500 | 1000 | 2000;
export type ISO = 100 | 200 | 400 | 800 | 1600 | 3200;
export type FocalLength = 24 | 35 | 50 | 85 | 135;
export type SubjectDistanceM = 1 | 2 | 4 | 8;

export type FocusMode = "auto-subject" | "target";

export interface CameraSettings {
  aperture: Aperture;
  shutterDenominator: ShutterDenominator;
  iso: ISO;
  focalLengthMm: FocalLength;
  subjectDistanceM: SubjectDistanceM;
  focusMode: FocusMode;
  focusTargetId: string;
  panningEnabled: boolean;
}

export interface SceneExposure {
  ev100: number;
}

export interface MotionModel {
  direction: [number, number];
  speedMps: number;
  subjectDistanceM: number;
}

export interface ExposureResult {
  cameraEv100: number;
  deltaStops: number;
  exposureMultiplier: number;
  highlightClippingRisk: number;
  shadowLossRisk: number;
}

export interface OpticsResult {
  verticalFovDeg: number;
  horizontalFovDeg: number;
  focusDistanceM: number;
  foregroundBlurPx: number;
  backgroundBlurPx: number;
}

export interface MotionResult {
  blurPx: number;
  normalizedBlur: number;
  direction: [number, number];
}

export interface ImageEffectResult {
  noiseStrength: number;
  clipping: {
    highlights: number;
    shadows: number;
  };
}

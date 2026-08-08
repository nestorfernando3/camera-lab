import type { CameraSettings } from "../../domain/camera/types";

export type GuidanceMode = "more" | "standard";

export function guidanceFromActions(actions: Array<{ shutterDenominator?: number; aperture?: number }>): GuidanceMode {
  // Simple heuristic: if learner struggles with shutter vs aperture, give more guidance
  const hasShortShutter = actions.some((a) => (a.shutterDenominator ?? 0) >= 500);
  const hasWideAperture = actions.some((a) => (a.aperture ?? 8) <= 2.8);
  if (!hasShortShutter || !hasWideAperture) return "more";
  return "standard";
}

export function defaultCameraSettings(): CameraSettings {
  return {
    aperture: 4,
    shutterDenominator: 125,
    iso: 200,
    focalLengthMm: 50,
    subjectDistanceM: 2,
    focusMode: "auto-subject",
    focusTargetId: "portrait-subject",
    panningEnabled: false,
  };
}

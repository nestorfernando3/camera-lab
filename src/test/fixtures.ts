import type { CameraSettings } from "../domain/camera/types";

export const defaultSettings: CameraSettings = {
  aperture: 4,
  shutterDenominator: 125,
  iso: 400,
  focalLengthMm: 50,
  subjectDistanceM: 2,
  focusMode: "auto-subject",
  focusTargetId: "portrait-subject",
  panningEnabled: false,
};

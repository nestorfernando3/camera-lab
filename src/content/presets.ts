import type { CameraSettings } from "../domain/camera/types";

export interface Preset {
  id: string;
  labelKey: string;
  settings: Partial<CameraSettings>;
}

export const PRESETS: Preset[] = [
  {
    id: "freeze",
    labelKey: "sandbox.presets.freeze",
    settings: { shutterDenominator: 1000, aperture: 4, iso: 400, focalLengthMm: 50 },
  },
  {
    id: "shallow",
    labelKey: "sandbox.presets.shallow",
    settings: { aperture: 1.4, focalLengthMm: 85, subjectDistanceM: 2, iso: 200, shutterDenominator: 250 },
  },
  {
    id: "deep",
    labelKey: "sandbox.presets.deep",
    settings: { aperture: 11, focalLengthMm: 35, subjectDistanceM: 4, iso: 200, shutterDenominator: 125 },
  },
  {
    id: "lowlight",
    labelKey: "sandbox.presets.lowlight",
    settings: { aperture: 2, shutterDenominator: 60, iso: 1600, focalLengthMm: 50 },
  },
  {
    id: "panning",
    labelKey: "sandbox.presets.panning",
    settings: { shutterDenominator: 30, panningEnabled: true, aperture: 8, iso: 100, focalLengthMm: 50 },
  },
];

import type { Aperture, FocalLength, ISO, ShutterDenominator, SubjectDistanceM } from "./types";

export const APERTURES: readonly Aperture[] = [1.4, 2, 2.8, 4, 5.6, 8, 11, 16] as const;
export const SHUTTER_DENOMINATORS: readonly ShutterDenominator[] = [15, 30, 60, 125, 250, 500, 1000, 2000] as const;
export const ISO_VALUES: readonly ISO[] = [100, 200, 400, 800, 1600, 3200] as const;
export const FOCAL_LENGTHS: readonly FocalLength[] = [24, 35, 50, 85, 135] as const;
export const SUBJECT_DISTANCES: readonly SubjectDistanceM[] = [1, 2, 4, 8] as const;

export const SENSOR_WIDTH_MM = 36;
export const SENSOR_HEIGHT_MM = 24;

export const RENDER_WIDTH_PX = 1280;

export function isAperture(v: number): v is Aperture {
  return (APERTURES as readonly number[]).includes(v);
}
export function isShutterDenominator(v: number): v is ShutterDenominator {
  return (SHUTTER_DENOMINATORS as readonly number[]).includes(v);
}
export function isISO(v: number): v is ISO {
  return (ISO_VALUES as readonly number[]).includes(v);
}
export function isFocalLength(v: number): v is FocalLength {
  return (FOCAL_LENGTHS as readonly number[]).includes(v);
}

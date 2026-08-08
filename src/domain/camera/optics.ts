import { SENSOR_HEIGHT_MM, SENSOR_WIDTH_MM } from "./constants";

export function fieldOfViewDeg(
  focalLengthMm: number,
  sensorDimensionMm: number
): number {
  const rad = 2 * Math.atan(sensorDimensionMm / (2 * focalLengthMm));
  return (rad * 180) / Math.PI;
}

export function blurCircleMm(args: {
  focalLengthMm: number;
  aperture: number;
  focusDistanceM: number;
  objectDistanceM: number;
}): number {
  const f = args.focalLengthMm;
  const objectDistMm = args.objectDistanceM * 1000;
  const focusDistMm = args.focusDistanceM * 1000;
  if (objectDistMm <= f || focusDistMm <= f) return 0;
  const objectImageDist = (f * objectDistMm) / (objectDistMm - f);
  const focusImageDist = (f * focusDistMm) / (focusDistMm - f);
  const apertureDiameter = f / args.aperture;
  if (objectImageDist === 0) return 0;
  return (apertureDiameter * Math.abs(objectImageDist - focusImageDist)) / objectImageDist;
}

export function blurCirclePx(args: {
  focalLengthMm: number;
  aperture: number;
  focusDistanceM: number;
  objectDistanceM: number;
  renderWidthPx: number;
}): number {
  const blurMm = blurCircleMm(args);
  return (blurMm / SENSOR_WIDTH_MM) * args.renderWidthPx;
}

export function opticsResult(args: {
  focalLengthMm: number;
  focusDistanceM: number;
  foregroundDistanceM: number;
  backgroundDistanceM: number;
  renderWidthPx: number;
  aperture: number;
}): { verticalFovDeg: number; horizontalFovDeg: number; foregroundBlurPx: number; backgroundBlurPx: number } {
  const horizontalFovDeg = fieldOfViewDeg(args.focalLengthMm, SENSOR_WIDTH_MM);
  const verticalFovDeg = fieldOfViewDeg(args.focalLengthMm, SENSOR_HEIGHT_MM);
  const foregroundBlurPx = blurCirclePx({
    focalLengthMm: args.focalLengthMm,
    aperture: args.aperture,
    focusDistanceM: args.focusDistanceM,
    objectDistanceM: args.foregroundDistanceM,
    renderWidthPx: args.renderWidthPx,
  });
  const backgroundBlurPx = blurCirclePx({
    focalLengthMm: args.focalLengthMm,
    aperture: args.aperture,
    focusDistanceM: args.focusDistanceM,
    objectDistanceM: args.backgroundDistanceM,
    renderWidthPx: args.renderWidthPx,
  });
  return { verticalFovDeg, horizontalFovDeg, foregroundBlurPx, backgroundBlurPx };
}

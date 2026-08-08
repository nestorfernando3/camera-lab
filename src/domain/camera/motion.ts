import { SENSOR_WIDTH_MM } from "./constants";

export function motionBlurPx(args: {
  speedMps: number;
  subjectDistanceM: number;
  shutterSeconds: number;
  focalLengthMm: number;
  renderWidthPx: number;
}): number {
  const angularVelocity = args.speedMps / args.subjectDistanceM;
  const angularTravel = angularVelocity * args.shutterSeconds;
  const sensorTravelMm = args.focalLengthMm * angularTravel;
  return (sensorTravelMm / SENSOR_WIDTH_MM) * args.renderWidthPx;
}

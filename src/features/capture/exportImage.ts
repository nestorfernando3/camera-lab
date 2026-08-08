import type { CameraSettings } from "../../domain/camera/types";

export async function exportCapture(args: {
  image: Blob;
  settings: CameraSettings;
  includeSettingsCard: boolean;
}): Promise<Blob> {
  if (!args.includeSettingsCard) return args.image;

  const bitmap = await createImageBitmap(args.image);
  const footerH = 36;
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height + footerH;
  const ctx = canvas.getContext("2d");
  if (!ctx) return args.image;

  ctx.drawImage(bitmap, 0, 0);
  ctx.fillStyle = "#111111";
  ctx.fillRect(0, bitmap.height, canvas.width, footerH);
  ctx.fillStyle = "#f5f5f5";
  ctx.font = "12px monospace";
  const text = `f/${args.settings.aperture} 1/${args.settings.shutterDenominator} ISO${args.settings.iso} ${args.settings.focalLengthMm}mm ${args.settings.subjectDistanceM}m`;
  ctx.fillText(text, 10, bitmap.height + 22);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("exportCapture toBlob null"));
      bitmap.close();
    }, "image/png");
  });
}

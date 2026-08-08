export function luminanceHistogram(pixels: Uint8ClampedArray, bins = 64): number[] {
  const hist = new Array(bins).fill(0);
  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    const idx = Math.min(bins - 1, Math.floor((lum / 256) * bins));
    hist[idx]++;
  }
  const total = pixels.length / 4;
  if (total === 0) return hist;
  return hist.map((c) => c / total);
}

export function histogramFromCanvas(canvas: HTMLCanvasElement, bins = 64): number[] {
  const scale = 64;
  const off = document.createElement("canvas");
  off.width = scale;
  off.height = scale;
  const ctx = off.getContext("2d");
  if (!ctx) return new Array(bins).fill(0);
  ctx.drawImage(canvas, 0, 0, scale, scale);
  const data = ctx.getImageData(0, 0, scale, scale).data;
  return luminanceHistogram(data, bins);
}

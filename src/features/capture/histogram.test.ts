import { describe, expect, it } from "vitest";
import { luminanceHistogram } from "./histogram";

describe("luminanceHistogram", () => {
  it("black pixels go to first bin, white to last", () => {
    const black = new Uint8ClampedArray([0, 0, 0, 255, 0, 0, 0, 255]);
    const histBlack = luminanceHistogram(black, 4);
    expect(histBlack[0]).toBe(1);
    expect(histBlack[3]).toBe(0);

    const white = new Uint8ClampedArray([255, 255, 255, 255, 255, 255, 255, 255]);
    const histWhite = luminanceHistogram(white, 4);
    expect(histWhite[3]).toBe(1);
  });

  it("mixed pixels distribute", () => {
    const pixels = new Uint8ClampedArray([
      0, 0, 0, 255,
      255, 255, 255, 255,
    ]);
    const hist = luminanceHistogram(pixels, 2);
    expect(hist[0]).toBeCloseTo(0.5, 5);
    expect(hist[1]).toBeCloseTo(0.5, 5);
  });

  it("default bins 64", () => {
    const pixels = new Uint8ClampedArray([100, 100, 100, 255]);
    expect(luminanceHistogram(pixels).length).toBe(64);
  });
});

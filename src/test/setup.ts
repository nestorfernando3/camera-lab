import "@testing-library/jest-dom/vitest";

// Polyfill ResizeObserver for @react-three/fiber / drei in jsdom
if (typeof globalThis.ResizeObserver === "undefined") {
  class RO {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  (globalThis as unknown as Record<string, unknown>).ResizeObserver = RO;
  if (typeof window !== "undefined") (window as unknown as Record<string, unknown>).ResizeObserver = RO;
}

// Mock WebGL context for jsdom canvas
if (typeof HTMLCanvasElement !== "undefined") {
  const origGetContext = HTMLCanvasElement.prototype.getContext;
  (HTMLCanvasElement.prototype as unknown as Record<string, unknown>).getContext = function (
    type: string,
    ...args: unknown[]
  ) {
    if (type === "webgl" || type === "webgl2" || type === "experimental-webgl") {
      return {} as unknown as RenderingContext;
    }
    return (origGetContext as unknown as (t: string, ...a: unknown[]) => unknown).call(this, type, ...args);
  } as unknown as typeof HTMLCanvasElement.prototype.getContext;
}

import { getAllEvents } from "./db";

export async function exportTelemetry(): Promise<Blob> {
  const events = await getAllEvents();
  const json = JSON.stringify(events, null, 2);
  return new Blob([json], { type: "application/json" });
}

export function downloadTelemetry(blob: Blob, filename = "cameralab-telemetry.json") {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

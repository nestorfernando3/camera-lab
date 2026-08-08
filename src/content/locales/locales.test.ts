import { describe, expect, it } from "vitest";
import es from "./es.json";
import en from "./en.json";

function flatten(obj: Record<string, unknown>, prefix = ""): string[] {
  const keys: string[] = [];
  for (const [k, v] of Object.entries(obj)) {
    const full = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) {
      keys.push(...flatten(v as Record<string, unknown>, full));
    } else {
      keys.push(full);
    }
  }
  return keys;
}

function flatKeys(obj: Record<string, unknown>): string[] {
  // JSON is flat with dotted keys already, but handle nested just in case
  return flatten(obj).sort();
}

describe("locales parity", () => {
  it("es and en have same keys", () => {
    const esKeys = flatKeys(es as unknown as Record<string, unknown>);
    const enKeys = flatKeys(en as unknown as Record<string, unknown>);
    expect(esKeys).toEqual(enKeys);
  });
});

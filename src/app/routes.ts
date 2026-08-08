import type { ScreenId } from "./appStore";

export function screenToHash(screen: ScreenId, missionId?: string | null): string {
  if (screen === "lab" && missionId) return `#lab/${missionId}`;
  return `#${screen}`;
}

export function hashToScreen(hash: string): { screen: ScreenId; missionId: string | null } {
  const clean = hash.replace(/^#/, "");
  if (clean.startsWith("lab/")) {
    const missionId = clean.slice(4);
    return { screen: "lab", missionId: missionId || null };
  }
  const valid: ScreenId[] = [
    "home",
    "onboarding",
    "curriculum",
    "lab",
    "sandbox",
    "reference",
    "progress",
    "settings",
    "final-mastery",
  ];
  if ((valid as string[]).includes(clean)) return { screen: clean as ScreenId, missionId: null };
  return { screen: "home", missionId: null };
}

export function syncHash(screen: ScreenId, missionId: string | null) {
  const hash = screenToHash(screen, missionId);
  if (typeof window !== "undefined" && window.location.hash !== hash) {
    window.location.hash = hash;
  }
}

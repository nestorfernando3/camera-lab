import type { MasteryLevel } from "./types";

export interface MissionHistoryEntry {
  missionId: string;
  completed: boolean;
  hintsUsed: number;
  attempts: number;
}

const CONCEPT_MAP: Record<string, string[]> = {
  "freeze-runner": ["shutter"],
  "motion-and-light": ["shutter", "iso"],
  "low-light-runner": ["shutter", "aperture", "iso", "trade-offs"],
  "separate-subject": ["aperture"],
  "keep-context": ["aperture", "iso"],
  "portrait-tradeoff": ["aperture", "shutter", "iso", "trade-offs"],
  "recover-exposure": ["iso", "stops"],
  "avoid-noise": ["aperture", "iso", "trade-offs"],
  "protect-tones": ["shutter", "aperture", "iso", "trade-offs"],
  "one-stop-exchange": ["stops", "aperture", "shutter"],
  "same-exposure-different-image": ["stops", "shutter", "trade-offs"],
  "choose-the-compromise": ["shutter", "aperture", "iso", "trade-offs"],
  "change-field-of-view": ["focal-length"],
  "distance-and-background": ["focal-length", "distance", "focus"],
  "choose-focus": ["focus", "aperture", "focal-length"],
  "editorial-portrait": ["aperture", "iso", "trade-offs", "focal-length"],
  "runner-at-dusk": ["shutter", "iso", "trade-offs"],
  "intentional-panning": ["shutter", "focus", "trade-offs"],
};

export function deriveMastery(args: {
  missionHistory: MissionHistoryEntry[];
}): Record<string, MasteryLevel> {
  const concepts = new Set<string>();
  for (const entry of args.missionHistory) {
    const cs = CONCEPT_MAP[entry.missionId] ?? [];
    cs.forEach((c) => concepts.add(c));
  }

  // ensure all possible concepts are represented even if unexplored
  const allConcepts = [
    "shutter",
    "aperture",
    "iso",
    "stops",
    "focal-length",
    "distance",
    "focus",
    "trade-offs",
  ];

  const result: Record<string, MasteryLevel> = {};

  for (const concept of allConcepts) {
    const relevant = args.missionHistory.filter((e) => {
      const cs = CONCEPT_MAP[e.missionId] ?? [];
      return cs.includes(concept);
    });

    if (relevant.length === 0) {
      result[concept] = "unexplored";
      continue;
    }

    const successesLowHint = relevant.filter((e) => e.completed && e.hintsUsed <= 1).length;
    if (successesLowHint >= 2) {
      result[concept] = "solid";
      continue;
    }
    if (successesLowHint >= 1 && relevant.filter((e) => e.completed).length >= 2) {
      result[concept] = "solid";
      continue;
    }

    // attempted or completed with heavy support
    const anyAttempt = relevant.some((e) => e.attempts > 0 || e.completed);
    if (anyAttempt) {
      result[concept] = "developing";
    } else {
      result[concept] = "unexplored";
    }
  }

  // Also ensure any concept seen but not in allConcepts gets developing
  for (const c of concepts) {
    if (!(c in result)) result[c] = "developing";
  }

  return result;
}

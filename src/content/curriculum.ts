import { MISSIONS } from "./missions";

export interface CurriculumModule {
  id: string;
  titleKey: string;
  descriptionKey: string;
  missionIds: string[];
}

export const MODULES: CurriculumModule[] = [
  {
    id: "m1",
    titleKey: "curriculum.m1.title",
    descriptionKey: "curriculum.m1.desc",
    missionIds: ["freeze-runner", "motion-and-light", "low-light-runner"],
  },
  {
    id: "m2",
    titleKey: "curriculum.m2.title",
    descriptionKey: "curriculum.m2.desc",
    missionIds: ["separate-subject", "keep-context", "portrait-tradeoff"],
  },
  {
    id: "m3",
    titleKey: "curriculum.m3.title",
    descriptionKey: "curriculum.m3.desc",
    missionIds: ["recover-exposure", "avoid-noise", "protect-tones"],
  },
  {
    id: "m4",
    titleKey: "curriculum.m4.title",
    descriptionKey: "curriculum.m4.desc",
    missionIds: ["one-stop-exchange", "same-exposure-different-image", "choose-the-compromise"],
  },
  {
    id: "m5",
    titleKey: "curriculum.m5.title",
    descriptionKey: "curriculum.m5.desc",
    missionIds: ["change-field-of-view", "distance-and-background", "choose-focus"],
  },
];

export function getMissionById(id: string) {
  return MISSIONS.find((m) => m.id === id) ?? null;
}

export function getModuleById(id: string) {
  return MODULES.find((m) => m.id === id) ?? null;
}

export function nextRecommendedModuleId(completedModuleIds: string[]): string | null {
  for (const mod of MODULES) {
    if (!completedModuleIds.includes(mod.id)) return mod.id;
  }
  return null;
}

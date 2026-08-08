export interface SceneConfig {
  id: "runner" | "portrait" | "depth";
  defaultEv100: number;
  backgroundDistanceM: number;
  focusTargets: Array<{
    id: string;
    distanceM: number;
  }>;
}

export const SCENES: Record<SceneConfig["id"], SceneConfig> = {
  runner: {
    id: "runner",
    defaultEv100: 11,
    backgroundDistanceM: 12,
    focusTargets: [{ id: "runner-subject", distanceM: 4 }],
  },
  portrait: {
    id: "portrait",
    defaultEv100: 10,
    backgroundDistanceM: 10,
    focusTargets: [{ id: "portrait-subject", distanceM: 2 }],
  },
  depth: {
    id: "depth",
    defaultEv100: 10,
    backgroundDistanceM: 10,
    focusTargets: [
      { id: "depth-foreground", distanceM: 1 },
      { id: "depth-mid", distanceM: 2 },
      { id: "depth-background", distanceM: 4 },
      { id: "depth-far", distanceM: 10 },
    ],
  },
};

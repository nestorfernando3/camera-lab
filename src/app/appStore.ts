import { create } from "zustand";

export type ScreenId =
  | "home"
  | "onboarding"
  | "curriculum"
  | "lab"
  | "sandbox"
  | "reference"
  | "progress"
  | "settings"
  | "final-mastery";

interface AppState {
  screen: ScreenId;
  currentModuleId: string | null;
  currentMissionId: string | null;
  navigate: (screen: ScreenId) => void;
  openMission: (missionId: string) => void;
  openModule: (moduleId: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  screen: "home",
  currentModuleId: null,
  currentMissionId: null,
  navigate: (screen) => set({ screen }),
  openMission: (missionId) => set({ screen: "lab", currentMissionId: missionId }),
  openModule: (moduleId) => set({ screen: "curriculum", currentModuleId: moduleId }),
}));

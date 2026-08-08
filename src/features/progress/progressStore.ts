import { create } from "zustand";
import { loadProgress, saveProgress, type ProgressState } from "./persistence";
import { deriveMastery } from "../../domain/learning/mastery";

interface ProgressStore extends ProgressState {
  markMissionCompleted: (missionId: string, moduleId: string, hintsUsed: number, attempts: number) => void;
  setLocale: (locale: "es" | "en") => void;
  setReducedMotion: (v: boolean) => void;
  setSoundEnabled: (v: boolean) => void;
  resetModule: (moduleId: string) => void;
  resetAll: () => void;
}

function computeModules(completedMissionIds: string[]): string[] {
  const map: Record<string, string[]> = {
    m1: ["freeze-runner", "motion-and-light", "low-light-runner"],
    m2: ["separate-subject", "keep-context", "portrait-tradeoff"],
    m3: ["recover-exposure", "avoid-noise", "protect-tones"],
    m4: ["one-stop-exchange", "same-exposure-different-image", "choose-the-compromise"],
    m5: ["change-field-of-view", "distance-and-background", "choose-focus"],
  };
  const completedModules: string[] = [];
  for (const [mod, mids] of Object.entries(map)) {
    if (mids.every((id) => completedMissionIds.includes(id))) completedModules.push(mod);
  }
  return completedModules;
}

export const useProgressStore = create<ProgressStore>((set, get) => {
  const initial = loadProgress();
  return {
    ...initial,
    markMissionCompleted: (missionId, moduleId, hintsUsed, attempts) => {
      const state = get();
      const completedMissionIds = state.completedMissionIds.includes(missionId)
        ? state.completedMissionIds
        : [...state.completedMissionIds, missionId];
      const completedModuleIds = computeModules(completedMissionIds);
      // derive mastery from history
      const history = completedMissionIds.map((id) => ({
        missionId: id,
        completed: true,
        hintsUsed: id === missionId ? hintsUsed : 1,
        attempts: id === missionId ? attempts : 2,
      }));
      const mastery = deriveMastery({ missionHistory: history });
      const next: ProgressState = {
        schemaVersion: 1,
        completedMissionIds,
        completedModuleIds,
        mastery,
        lastScreen: state.lastScreen,
        lastMissionId: missionId,
        locale: state.locale,
        reducedMotion: state.reducedMotion,
        soundEnabled: state.soundEnabled,
      };
      saveProgress(next);
      set({ ...next, markMissionCompleted: get().markMissionCompleted, setLocale: get().setLocale, setReducedMotion: get().setReducedMotion, setSoundEnabled: get().setSoundEnabled, resetModule: get().resetModule, resetAll: get().resetAll });
      void moduleId;
    },
    setLocale: (locale) => {
      const s = get();
      const next = { ...s, locale };
      saveProgress(next);
      set({ locale });
    },
    setReducedMotion: (v) => {
      const s = get();
      const next = { ...s, reducedMotion: v };
      saveProgress(next);
      set({ reducedMotion: v });
    },
    setSoundEnabled: (v) => {
      const s = get();
      const next = { ...s, soundEnabled: v };
      saveProgress(next);
      set({ soundEnabled: v });
    },
    resetModule: (moduleId) => {
      const s = get();
      const filteredMissions = s.completedMissionIds.filter((id) => {
        const modMap: Record<string, string> = {
          "freeze-runner": "m1",
          "motion-and-light": "m1",
          "low-light-runner": "m1",
          "separate-subject": "m2",
          "keep-context": "m2",
          "portrait-tradeoff": "m2",
          "recover-exposure": "m3",
          "avoid-noise": "m3",
          "protect-tones": "m3",
          "one-stop-exchange": "m4",
          "same-exposure-different-image": "m4",
          "choose-the-compromise": "m4",
          "change-field-of-view": "m5",
          "distance-and-background": "m5",
          "choose-focus": "m5",
        };
        return modMap[id] !== moduleId;
      });
      const completedModuleIds = computeModules(filteredMissions);
      const next: ProgressState = {
        schemaVersion: 1,
        completedMissionIds: filteredMissions,
        completedModuleIds,
        mastery: s.mastery,
        lastScreen: s.lastScreen,
        lastMissionId: s.lastMissionId,
        locale: s.locale,
        reducedMotion: s.reducedMotion,
        soundEnabled: s.soundEnabled,
      };
      saveProgress(next);
      set({ completedMissionIds: filteredMissions, completedModuleIds });
    },
    resetAll: () => {
      try {
        localStorage.removeItem("cameralab:v1:progress");
      } catch {}
      try {
        const req = indexedDB.deleteDatabase("cameralab");
        void req;
      } catch {}
      set({
        completedMissionIds: [],
        completedModuleIds: [],
        mastery: {},
        lastScreen: "home",
        lastMissionId: null,
        locale: "es",
        reducedMotion: false,
        soundEnabled: true,
      });
    },
  };
});

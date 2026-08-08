export interface ProgressState {
  schemaVersion: 1;
  completedMissionIds: string[];
  completedModuleIds: string[];
  mastery: Record<string, "unexplored" | "developing" | "solid">;
  lastScreen: string;
  lastMissionId: string | null;
  locale: "es" | "en";
  reducedMotion: boolean;
  soundEnabled: boolean;
}

const KEY = "cameralab:v1:progress";

const DEFAULT: ProgressState = {
  schemaVersion: 1,
  completedMissionIds: [],
  completedModuleIds: [],
  mastery: {},
  lastScreen: "home",
  lastMissionId: null,
  locale: "es",
  reducedMotion: false,
  soundEnabled: true,
};

export function loadProgress(): ProgressState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT };
    const parsed = JSON.parse(raw);
    if (parsed.schemaVersion !== 1) return { ...DEFAULT };
    return { ...DEFAULT, ...parsed };
  } catch {
    return { ...DEFAULT };
  }
}

export function saveProgress(state: ProgressState): void {
  try {
    // Do not store large image data URLs; state already contains only metadata
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {}
}

export function resetModuleProgress(moduleId: string): void {
  const state = loadProgress();
  // Remove mission ids that belong to module (we need import lazily to avoid circular)
  // For simplicity, just filter by module prefix if needed; caller should provide missionIds
  // This stub just clears module id
  state.completedModuleIds = state.completedModuleIds.filter((id) => id !== moduleId);
  saveProgress(state);
}

export function resetAllProgress(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {}
  try {
    // Clear IndexedDB as well - caller will handle DB clear
    const req = indexedDB.deleteDatabase("cameralab");
    void req;
  } catch {}
}

export const PROGRESS_KEY = KEY;
export const DEFAULT_PROGRESS = DEFAULT;

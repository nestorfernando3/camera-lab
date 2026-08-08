import { create } from "zustand";
import type { CameraSettings } from "../../domain/camera/types";
import type { CaptureSnapshot, MetricName } from "../../domain/learning/types";
import { simulateCapture } from "../../domain/camera/simulate";
import { SCENES } from "../../scenes/sceneRegistry";
import { MISSIONS } from "../../content/missions";
import { evaluateMission } from "../../domain/learning/evaluateMission";
import { trackEvent } from "../telemetry/telemetry";

export interface CaptureAttempt extends CaptureSnapshot {
  id: string;
  missionId: string;
  createdAt: string;
  imageDataUrl?: string;
}

interface LabState {
  currentMissionId: string | null;
  settings: CameraSettings;
  captures: CaptureAttempt[];
  phase: "brief" | "predict-by-action" | "explore" | "capture" | "feedback" | "complete";
  hintLevel: 0 | 1 | 2;
  setSetting: <K extends keyof CameraSettings>(key: K, value: CameraSettings[K]) => void;
  setMission: (missionId: string) => void;
  capture: () => void;
  nextHint: () => void;
  reset: () => void;
}

function defaultSettings(missionId: string | null): CameraSettings {
  const m = MISSIONS.find((x) => x.id === missionId);
  if (m) return { ...m.initialSettings };
  return {
    aperture: 4,
    shutterDenominator: 125,
    iso: 400,
    focalLengthMm: 50,
    subjectDistanceM: 2,
    focusMode: "auto-subject",
    focusTargetId: "portrait-subject",
    panningEnabled: false,
  };
}

export const useLabStore = create<LabState>((set, get) => ({
  currentMissionId: null,
  settings: defaultSettings(null),
  captures: [],
  phase: "brief",
  hintLevel: 0,

  setSetting: (key, value) =>
    set((s) => ({
      settings: { ...s.settings, [key]: value },
      phase: s.phase === "brief" ? "explore" : s.phase,
    })),

  setMission: (missionId) =>
    set({
      currentMissionId: missionId,
      settings: defaultSettings(missionId),
      captures: [],
      phase: "brief",
      hintLevel: 0,
    }),

  capture: () => {
    const { currentMissionId, settings, captures, hintLevel } = get();
    if (!currentMissionId) return;
    const mission = MISSIONS.find((m) => m.id === currentMissionId);
    if (!mission) return;
    const scene = SCENES[mission.sceneId];
    const snap = simulateCapture(settings, {
      ev100: mission.sceneEv100,
      renderWidthPx: 1280,
      foregroundDistanceM: 1,
      backgroundDistanceM: scene.backgroundDistanceM,
      focusDistanceM: settings.subjectDistanceM,
      subjectSpeedMps: mission.sceneId === "runner" ? 4 : 0,
    });
    const attempt: CaptureAttempt = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      missionId: currentMissionId,
      createdAt: new Date().toISOString(),
      settings: { ...settings },
      metrics: snap.metrics as Record<MetricName, number>,
    };
    const newCaptures = [...captures, attempt].slice(-10);
    const max = mission.maxVisibleCaptures;
    const visibleCaptures = newCaptures.slice(-max);
    const evalResult = evaluateMission({ mission, captures: visibleCaptures });
    const passed = evalResult.passed;
    const phase = passed ? "feedback" : newCaptures.length > 0 ? "capture" : "explore";
    set({ captures: newCaptures, phase });

    // telemetry (never block)
    try {
      trackEvent({
        missionId: currentMissionId,
        type: "capture_taken",
        payload: {
          motionBlurPx: snap.metrics.motionBlurPx,
          backgroundBlurPx: snap.metrics.backgroundBlurPx,
          exposureDeltaAbs: snap.metrics.exposureDeltaAbs,
          passed,
          hintLevel,
        },
      });
      if (passed) {
        trackEvent({ missionId: currentMissionId, type: "mission_completed", payload: { captures: newCaptures.length } });
        // persist progress lazily to avoid circular import
        import("../progress/persistence").then(({ loadProgress, saveProgress }) => {
          const p = loadProgress();
          if (!p.completedMissionIds.includes(currentMissionId)) {
            p.completedMissionIds.push(currentMissionId);
            const moduleMap: Record<string, string[]> = {
              m1: ["freeze-runner", "motion-and-light", "low-light-runner"],
              m2: ["separate-subject", "keep-context", "portrait-tradeoff"],
              m3: ["recover-exposure", "avoid-noise", "protect-tones"],
              m4: ["one-stop-exchange", "same-exposure-different-image", "choose-the-compromise"],
              m5: ["change-field-of-view", "distance-and-background", "choose-focus"],
            };
            for (const [mod, mids] of Object.entries(moduleMap)) {
              if (mids.every((id) => p.completedMissionIds.includes(id)) && !p.completedModuleIds.includes(mod)) {
                p.completedModuleIds.push(mod);
              }
            }
            saveProgress(p);
          }
        });
      }
    } catch {}
  },

  nextHint: () =>
    set((s) => ({
      hintLevel: s.hintLevel < 2 ? ((s.hintLevel + 1) as 0 | 1 | 2) : s.hintLevel,
    })),

  reset: () =>
    set((s) => ({
      captures: [],
      settings: defaultSettings(s.currentMissionId),
      phase: "brief",
      hintLevel: 0,
    })),
}));

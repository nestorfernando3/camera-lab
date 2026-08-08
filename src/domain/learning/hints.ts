import type { MissionDefinition } from "./types";

export function hintForAttempt(
  mission: MissionDefinition,
  hintLevel: 0 | 1 | 2
): string {
  return mission.hintKeys[hintLevel] ?? mission.hintKeys[0];
}

import { putEvent, type LearningEvent } from "./db";

const SESSION_ID = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export function trackEvent(event: Omit<LearningEvent, "id" | "occurredAt" | "sessionId">): void {
  const full: LearningEvent = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    occurredAt: new Date().toISOString(),
    sessionId: SESSION_ID,
    ...event,
  };
  // fire and forget, never block
  void putEvent(full);
}

export const sessionId = SESSION_ID;

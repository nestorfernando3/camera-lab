import { describe, expect, it } from "vitest";
import { deriveMastery } from "./mastery";

describe("mastery", () => {
  it("unexplored when no attempt", () => {
    const m = deriveMastery({ missionHistory: [] });
    expect(m.shutter).toBe("unexplored");
  });

  it("developing after one attempt with heavy hints", () => {
    const m = deriveMastery({
      missionHistory: [{ missionId: "freeze-runner", completed: true, hintsUsed: 3, attempts: 5 }],
    });
    expect(m.shutter).toBe("developing");
  });

  it("solid after two successes with <=1 hint", () => {
    const m = deriveMastery({
      missionHistory: [
        { missionId: "freeze-runner", completed: true, hintsUsed: 1, attempts: 2 },
        { missionId: "motion-and-light", completed: true, hintsUsed: 0, attempts: 2 },
      ],
    });
    expect(m.shutter).toBe("solid");
  });

  it("never displays raw points", () => {
    const m = deriveMastery({
      missionHistory: [{ missionId: "freeze-runner", completed: true, hintsUsed: 0, attempts: 1 }],
    });
    expect(JSON.stringify(m)).not.toContain("points");
    expect(JSON.stringify(m)).not.toContain("score");
  });
});

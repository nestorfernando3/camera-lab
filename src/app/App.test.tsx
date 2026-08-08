import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { App } from "./App";

describe("App", () => {
  it("renders CameraLab", () => {
    render(<App />);
    expect(screen.getByText("CameraLab")).toBeInTheDocument();
  });
});

import { test, expect } from "@playwright/test";

test.describe("Mission flow", () => {
  test("change shutter → metrics change → Capture → feedback", async ({ page }) => {
    await page.goto("/#lab/freeze-runner");

    // Initial metrics
    const metrics = page.getByTestId("render-metrics");
    await expect(metrics).toBeHidden(); // hidden but exists
    const initialBlur = await metrics.getAttribute("data-motion-blur");
    expect(initialBlur).not.toBeNull();

    // Change shutter to faster (1/1000) - freeze-runner only has shutter control
    await page.getByRole("button", { name: "Obturador 1/1000" }).click();

    // Metrics should change (blur should decrease)
    const afterBlur = await metrics.getAttribute("data-motion-blur");
    expect(afterBlur).not.toBe(initialBlur);
    const blurValue = parseFloat(afterBlur!);
    expect(blurValue).toBeLessThan(parseFloat(initialBlur!));

    // Capture
    await page.getByTestId("capture-button").click();

    // Feedback should render
    await expect(page.getByTestId("feedback-panel")).toBeVisible();
    // Should show Achieved sections
    await expect(page.getByText("Conseguiste")).toBeVisible();
    await expect(page.getByText("Observa")).toBeVisible();
    await expect(page.getByText("Compromiso")).toBeVisible();

    // Capture count should be 1
    await expect(page.getByTestId("capture-count")).toContainText("1");
  });

  test("comparison tray shows up to maxVisible", async ({ page }) => {
    // motion-and-light has maxVisible 2
    await page.goto("/#lab/motion-and-light");
    await page.getByTestId("capture-button").click();
    await page.getByTestId("capture-button").click();
    await expect(page.getByTestId("comparison-tray")).toHaveAttribute("data-mode", "ab");
    await expect(page.getByTestId("compare-slot-0")).toBeVisible();
    await expect(page.getByTestId("compare-slot-1")).toBeVisible();
  });
});

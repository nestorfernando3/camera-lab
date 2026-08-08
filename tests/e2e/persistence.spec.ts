import { test, expect } from "@playwright/test";

test.describe("Persistence", () => {
  test("complete mission → reload → completion remains", async ({ page }) => {
    await page.goto("/#lab/freeze-runner");
    // Set shutter to freezing speed
    await page.getByRole("button", { name: "Obturador 1/1000" }).click();
    await page.getByTestId("capture-button").click();
    await expect(page.getByTestId("feedback-panel")).toBeVisible();

    // Check localStorage progress
    const before = await page.evaluate(() => localStorage.getItem("cameralab:v1:progress"));
    expect(before).not.toBeNull();
    expect(before).toContain("freeze-runner");

    // Reload
    await page.reload();
    await expect(page.getByText("CameraLab").first()).toBeVisible();

    const after = await page.evaluate(() => localStorage.getItem("cameralab:v1:progress"));
    expect(after).toContain("freeze-runner");

    // Navigate to curriculum and check that progress is still there
    await page.goto("/#curriculum");
    await expect(page.getByTestId("module-m1")).toBeVisible();
  });

  test("reset all clears progress", async ({ page }) => {
    await page.goto("/#lab/freeze-runner");
    await page.getByRole("button", { name: "Obturador 1/1000" }).click();
    await page.getByTestId("capture-button").click();
    await expect(page.getByTestId("feedback-panel")).toBeVisible();

    await page.goto("/#settings");
    // Mock confirm
    page.on("dialog", async (dialog) => await dialog.accept());
    await page.getByTestId("reset-all").click();

    const after = await page.evaluate(() => localStorage.getItem("cameralab:v1:progress"));
    // After reset, key removed or empty
    expect(after === null || !after.includes("freeze-runner")).toBeTruthy();
  });
});

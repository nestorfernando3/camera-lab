import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("Home → Curriculum → Module 1 → Mission 1", async ({ page }) => {
    await page.goto("/#home");
    await expect(page.getByText("CameraLab").first()).toBeVisible();

    await page.getByRole("button", { name: "Ver currículo" }).click();
    await expect(page.getByText("Currículo")).toBeVisible();

    // All 5 modules visible
    for (const id of ["m1", "m2", "m3", "m4", "m5"]) {
      await expect(page.getByTestId(`module-${id}`)).toBeVisible();
    }

    // Recommended should be m1 initially
    await expect(page.getByTestId("module-m1")).toHaveAttribute("data-recommended", "true");

    // Open first mission
    await page.getByTestId("mission-freeze-runner").click();
    await expect(page.getByTestId("current-mission")).toContainText("freeze-runner");
    await expect(page.getByText("Lab")).toBeVisible();
  });

  test("can directly open Module 5 without completing Module 1", async ({ page }) => {
    await page.goto("/#curriculum");
    await expect(page.getByTestId("module-m5")).toBeVisible();

    // Module 5 should be clickable (not disabled)
    const openM5 = page.getByTestId("open-module-m5");
    await expect(openM5).toBeEnabled();
    await openM5.click();
    // Should open mission from m5 (change-field-of-view)
    await expect(page.getByTestId("current-mission")).toContainText("change-field-of-view");

    // Prerequisite note should be visible for later modules when early not completed
    await page.goto("/#curriculum");
    await expect(page.getByTestId("prereq-note-m5")).toBeVisible();
  });

  test("hash navigation works", async ({ page }) => {
    await page.goto("/#lab/freeze-runner");
    await expect(page.getByTestId("current-mission")).toContainText("freeze-runner");
    await page.goto("/#sandbox");
    await expect(page.getByText("Sandbox").first()).toBeVisible();
    await page.goto("/#reference");
    await expect(page.getByTestId("reference-sheet")).toBeVisible();
  });
});

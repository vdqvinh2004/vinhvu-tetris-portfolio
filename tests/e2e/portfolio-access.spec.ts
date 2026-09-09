import { expect, test } from "@playwright/test";

test("a recruiter can skip directly to the portfolio", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /skip intro/i }).click();

  await expect(page.getByRole("heading", { name: "Vinh Vu" })).toBeVisible();
  for (const section of ["About", "Skills", "Experience", "Projects", "Resume", "Contact"]) {
    await expect(page.getByRole("link", { name: section, exact: true })).toBeVisible();
  }
});

test("the game explains its controls and removes touch buttons on desktop", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  await expect(page.getByRole("heading", { name: /how to play/i })).toBeVisible();
  await expect(page.getByText("Space", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: /start game/i }).click();

  await expect(page.getByRole("button", { name: /move piece left/i })).toBeHidden();
});

test("small screens retain touch controls", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: /start game/i }).click();

  await expect(page.getByRole("button", { name: /move piece left/i })).toBeVisible();
  await expect(page.getByText(/Touch controls are available/i)).toBeVisible();
});

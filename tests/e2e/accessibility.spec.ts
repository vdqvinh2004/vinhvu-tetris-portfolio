import { expect, test } from "@playwright/test";

test("portfolio actions are keyboard accessible and use static destinations", async ({ page }) => {
  await page.goto("/");
  const skip = page.getByRole("button", { name: /skip intro/i });
  await skip.focus();
  await expect(skip).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#portfolio")).toBeFocused();

  const resume = page.getByRole("link", { name: /download resume/i });
  await expect(resume).toHaveAttribute("href", "/resume-placeholder.pdf");
  await expect(page.getByRole("link", { name: /email/i })).toHaveAttribute("href", /mailto:/);
  const wordmark = page.getByRole("link", { name: "VV / FIELD NOTES" });
  await wordmark.focus();
  await expect(wordmark).toBeFocused();
});

test("the game supports the documented desktop keyboard controls", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const console = page.locator(".game-console");
  await page.getByRole("button", { name: /play portfolio run/i }).click();
  await expect(console).toBeFocused();
  await page.keyboard.press("KeyA");
  await page.keyboard.press("KeyD");
  await page.keyboard.press("KeyS");
  await page.keyboard.press("KeyW");
  await page.keyboard.press("Space");

  await expect(console).toBeFocused();
  await expect(page.locator(".game-status")).toHaveText(/Clear 4 lines/i);
});

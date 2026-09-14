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
  await expect(page.getByRole("link", { name: "Email" })).toHaveAttribute("href", /mailto:/);
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

test("portfolio stays readable without horizontal overflow across key widths", async ({ page }) => {
  for (const width of [320, 375, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/portfolio");

    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth - innerWidth))
      .toBeLessThanOrEqual(1);
    await expect(page.getByRole("heading", { name: "Vinh Vu" })).toBeVisible();
  }
});

test("reduced motion keeps the game controls and instructions available", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 375, height: 844 });
  await page.goto("/");

  await expect(page.getByRole("heading", { name: /how to play/i })).toBeVisible();
  await page.getByRole("button", { name: /play portfolio run/i }).click();
  await expect(page.getByText(/reduced motion is on/i)).not.toBeVisible();
  await expect(page.getByRole("button", { name: /move piece left/i })).toBeVisible();
});

test("mobile controls keep usable targets and visible focus", async ({ page }) => {
  for (const width of [320, 375, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/");
    await page.getByRole("button", { name: /play portfolio run/i }).click();

    await expect(page.getByText(/Touch controls are available/i)).toBeVisible();
    const targets = await page.locator(".game-controls button").evaluateAll((buttons) =>
      buttons.map((button) => {
        const rect = button.getBoundingClientRect();
        return { height: rect.height, width: rect.width };
      }),
    );
    expect(targets).toHaveLength(4);
    expect(targets.every(({ height, width }) => height >= 44 && width >= 44)).toBe(true);

    const skip = page.getByRole("button", { name: /skip intro/i });
    await skip.focus();
    await expect(skip).toBeFocused();
  }
});

test("recruiter links expose direct destinations", async ({ page }) => {
  await page.goto("/portfolio");

  await expect(page.getByRole("link", { name: /download resume/i })).toHaveAttribute(
    "href",
    "/resume-placeholder.pdf",
  );
  await expect(page.getByRole("link", { name: /^github/i })).toHaveAttribute(
    "href",
    "https://github.com/vdqvinh2004",
  );
  await expect(page.getByRole("link", { name: /^linkedin/i })).toHaveAttribute(
    "href",
    /linkedin\.com\//,
  );
  await expect(page.getByRole("link", { name: /^email/i })).toHaveAttribute(
    "href",
    "mailto:vdqvinh2004@gmail.com",
  );
});

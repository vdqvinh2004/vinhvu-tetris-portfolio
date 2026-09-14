import { expect, test } from "@playwright/test";

test("a recruiter can skip directly to the portfolio", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /skip intro/i }).click();

  await expect(page).toHaveURL(/\/portfolio$/);
  await expect(page.getByRole("heading", { name: "Vinh Vu" })).toBeVisible();
  for (const section of ["About", "Skills", "Experience", "Projects", "Resume", "Contact"]) {
    await expect(page.getByRole("link", { name: section, exact: true })).toBeVisible();
  }
});

test("a visitor can skip from a scrolled game and land at portfolio top", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /play portfolio run/i }).click();
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = "auto";
    window.scrollTo(0, document.body.scrollHeight);
  });
  await page.evaluate(() => document.querySelector<HTMLButtonElement>(".skip-button")?.click());

  await expect(page).toHaveURL(/\/portfolio$/);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(20);
  await expect(page.getByRole("heading", { name: "Vinh Vu" })).toBeVisible();
});

test("a visitor can open the portfolio directly and return to a fresh game", async ({ page }) => {
  await page.goto("/portfolio");
  await expect(page.getByRole("heading", { name: "Vinh Vu" })).toBeVisible();
  await expect(page.locator(".portfolio-game-background")).toHaveCount(2);
  await expect(page.locator(".portfolio-ghost-cell.is-filled").first()).toBeAttached();
  await expect(page.locator(".portfolio-ghost-board")).toHaveCount(2);
  await expect(page.locator(".portfolio-ghost-board.is-left")).toHaveCount(1);
  await expect(page.locator(".portfolio-scene")).toBeAttached();

  await page.getByRole("link", { name: /play game/i }).click();

  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("button", { name: /play portfolio run/i })).toBeVisible();
});

test("the game explains its controls and removes touch buttons on desktop", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  await expect(page.getByRole("heading", { name: /how to play/i })).toBeVisible();
  await expect(page.getByText("Space", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: /play portfolio run/i }).click();

  await expect(page.getByRole("button", { name: /move piece left/i })).toBeHidden();
});

test("small screens retain touch controls", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: /play portfolio run/i }).click();

  await expect(page.getByRole("button", { name: /move piece left/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /hard drop piece/i })).toHaveText("Drop");
  await expect(page.getByRole("img", { name: /next block: I/i })).toBeVisible();
  await expect(page.locator(".game-live-label")).toHaveCount(0);
  await expect(page.getByText(/Touch controls are available/i)).toBeVisible();
});

test("the play stage stays inside the viewport on small screens", async ({ page }) => {
  for (const width of [320, 375, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/");
    await page.getByRole("button", { name: /play portfolio run/i }).click();

    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollHeight - innerHeight))
      .toBeLessThanOrEqual(1);
    await expect(page.getByRole("img", { name: /next block:/i })).toBeVisible();
  }
});

test("a visitor can recover from game over and skip afterward", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.getByRole("button", { name: /play portfolio run/i }).click();

  for (let piece = 0; piece < 14; piece += 1) {
    await page.evaluate(() => {
      const gameConsole = document.querySelector<HTMLElement>(".game-console");
      if (!gameConsole) throw new Error("Game console not found");
      for (let move = 0; move < 4; move += 1) {
        gameConsole.dispatchEvent(
          new KeyboardEvent("keydown", { bubbles: true, key: "ArrowLeft" }),
        );
      }
      gameConsole.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: " " }));
    });
    if (await page.getByText(/Game over/i).isVisible()) break;
  }

  await expect(page.getByText(/Game over/i)).toBeVisible();
  await page.getByRole("button", { name: /restart game/i }).click();
  await expect(page.getByRole("button", { name: /play portfolio run/i })).toBeVisible();

  await page.getByRole("button", { name: /skip intro/i }).click();
  await expect(page).toHaveURL(/\/portfolio$/);
});

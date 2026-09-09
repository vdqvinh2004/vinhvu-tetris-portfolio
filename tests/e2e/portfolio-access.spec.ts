import { expect, test } from "@playwright/test";

test("a recruiter can skip directly to the portfolio", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /skip intro/i }).click();

  await expect(page.getByRole("heading", { name: "Vinh Vu" })).toBeVisible();
  for (const section of ["About", "Skills", "Experience", "Projects", "Resume", "Contact"]) {
    await expect(page.getByRole("link", { name: section, exact: true })).toBeVisible();
  }
});

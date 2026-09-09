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
  const wordmark = page.getByRole("link", { name: "VV//01" });
  await wordmark.focus();
  await expect(wordmark).toBeFocused();
});

import { expect, test } from "@playwright/test";

test("keyboard users can skip the header and content fits the viewport", async ({
  page,
}) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skipLink = page.getByRole("link", { name: "Към съдържанието" });
  await expect(skipLink).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("a missing address returns 404 and lets visitors navigate home", async ({
  page,
}) => {
  const response = await page.goto("/missing-page");
  expect(response?.status()).toBe(404);
  await page.getByRole("link", { name: "Към началната страница" }).click();
  await expect(page).toHaveURL("/");
  await expect(page.getByRole("main")).toBeVisible();
});

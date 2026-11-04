import { expect, test } from "@playwright/test";

test("the header displays the B-Consult logo", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("Б-Консулт");
  const logo = page.getByRole("img", { name: "Б-Консулт — лого" });
  await expect(logo).toBeVisible();
  expect(
    await logo.evaluate((image: HTMLImageElement) => image.naturalWidth),
  ).toBeGreaterThan(0);
});

test("the homepage shows a service-focused modern feature card", async ({
  page,
}) => {
  await page.goto("/");
  const featureCard = page.getByRole("complementary", {
    name: "Основни направления",
  });
  await expect(featureCard).toBeVisible();
  await expect(
    featureCard.getByRole("heading", { name: "Основни направления" }),
  ).toBeVisible();
  await expect(featureCard.locator(".hero-card-services li")).toContainText([
    "Счетоводни услуги",
    "Административни услуги",
    "Застраховки",
  ]);
});

test("the services menu opens a service page", async ({ page, isMobile }) => {
  await page.goto("/");
  await expect(page.locator("main a")).toHaveCount(0);

  if (isMobile) {
    await page.locator(".mobile-navigation > summary").click();
    await page.locator(".mobile-service-menu > summary").click();
  } else {
    await page.locator(".desktop-service-menu > summary").click();
  }

  const navigation = page.getByRole("navigation", {
    name: "Основна навигация",
  });
  await navigation.getByRole("link", { name: "Счетоводни услуги" }).click();
  await expect(page).toHaveURL("/uslugi/schetovodni-uslugi");
  await expect(
    page.getByRole("heading", { name: "Счетоводни услуги" }),
  ).toBeVisible();
  if (isMobile) {
    await expect(
      page.getByRole("navigation", { name: "Основна навигация" }),
    ).toBeHidden();
  }
});

test("all listed services have their own page", async ({ page }) => {
  const servicePages = [
    ["schetovodni-uslugi", "Счетоводни услуги"],
    ["administrativni-uslugi", "Административни услуги"],
    [
      "sadeistvie-pred-darzhavni-institutsii",
      "Съдействие пред държавни институции",
    ],
    ["evropeiski-i-natsionalni-proekti", "Европейски и национални проекти"],
    ["registratsiya-na-firmi-i-npo", "Регистрация на фирми и НПО"],
    ["zastrahovki", "Застраховки"],
    ["dokumenti-za-pensionirane", "Документи за пенсиониране"],
  ];

  for (const [slug, title] of servicePages) {
    const response = await page.goto(`/uslugi/${slug}`);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { name: title })).toBeVisible();
    await expect(
      page.getByText("Подготвяме подробната информация за тази услуга."),
    ).toBeVisible();
  }
});

test("the contacts menu link opens the contact details", async ({
  page,
  isMobile,
}) => {
  await page.goto("/");

  if (isMobile) {
    await page.locator(".mobile-navigation > summary").click();
  }

  await page
    .getByRole("navigation", { name: "Основна навигация" })
    .getByRole("link", { name: "Контакти" })
    .click();

  await expect(page).toHaveURL("/kontakti");
  await expect(page.getByRole("heading", { name: "Контакти" })).toBeVisible();
  await expect(page.getByRole("link", { name: "0882961650" })).toHaveAttribute(
    "href",
    "tel:+359882961650",
  );
  await expect(page.getByRole("link", { name: "0887807097" })).toHaveAttribute(
    "href",
    "tel:+359887807097",
  );
  await expect(
    page.getByRole("link", { name: "office@bonev-consult.bg" }),
  ).toHaveAttribute("href", "mailto:office@bonev-consult.bg");
  await expect(page.getByText("Кирково, ул. „Дружба“ 2")).toBeVisible();

  if (isMobile) {
    await expect(
      page.getByRole("navigation", { name: "Основна навигация" }),
    ).toBeHidden();
  }
});

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
    await page.evaluate(() => {
      const { clientWidth, scrollWidth } = document.documentElement;
      return scrollWidth <= clientWidth;
    }),
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

test("an unknown service address returns 404", async ({ page }) => {
  const response = await page.goto("/uslugi/unknown-service");
  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { name: "Тази страница липсва." }),
  ).toBeVisible();
});

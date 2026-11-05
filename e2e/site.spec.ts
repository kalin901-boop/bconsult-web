import { expect, test } from "@playwright/test";

const marketQuotes = [
  { label: "1 EUR", value: "1,1267 USD", source: "ЕЦБ · 04.11.2026" },
  { label: "1 GBP", value: "1,3500 USD", source: "ЕЦБ · 04.11.2026" },
  {
    label: "Злато",
    value: "4 065,70 USD / тройунция",
    source: "Gold-API · 18:54",
  },
  {
    label: "Сребро",
    value: "52,27 USD / тройунция",
    source: "Gold-API · 18:54",
  },
  {
    label: "Брент",
    value: "128,08 USD / барел",
    source: "EIA / FRED · 03.11.2026",
  },
  {
    label: "Биткойн",
    value: "80 226,57 USD",
    source: "Gold-API · 18:54",
  },
];

test.beforeEach(async ({ page }) => {
  await page.route("**/api/market-data", (route) =>
    route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        quotes: marketQuotes,
        hasUnavailableSources: false,
      }),
    }),
  );
});

test("the header displays the B-Consult logo", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("Б-Консулт");
  const logo = page.getByRole("img", { name: "Б-Консулт — лого" });
  await expect(logo).toBeVisible();
  expect(
    await logo.evaluate((image: HTMLImageElement) => image.naturalWidth),
  ).toBeGreaterThan(0);
});

test("the market ticker shows Bulgaria time and all quotes", async ({
  page,
}) => {
  await page.goto("/");

  const ticker = page.getByRole("region", {
    name: "Час и пазарни котировки",
  });
  const clock = ticker.getByRole("timer", {
    name: "Точно време в България",
  });
  await expect(clock).toHaveText(/^\d{2}:\d{2}:\d{2}$/);
  await expect(ticker.locator(".ticker-quote-label").first()).toHaveText(
    "1 EUR",
  );
  await expect(ticker.locator(".ticker-quote-label").nth(4)).toHaveText(
    "Брент",
  );
  await expect(ticker.locator(".ticker-quote-label").nth(5)).toHaveText(
    "Биткойн",
  );
  await expect(
    ticker.getByText("информативни", { exact: false }),
  ).toBeVisible();
  await expect(ticker.getByText("на всеки 5 минути")).toBeVisible();
  await expect(ticker.locator(".ticker-quote-source").nth(2)).toHaveText(
    "Gold-API · 18:54",
  );
  await expect(
    ticker.locator(".ticker-quote").filter({ hasText: "Биткойн" }).first(),
  ).toContainText("USD");
});

test("the market ticker retries after five minutes", async ({ page }) => {
  await page.unroute("**/api/market-data");
  await page.clock.install();
  let requests = 0;
  await page.route("**/api/market-data", (route) => {
    requests += 1;
    return route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        quotes: marketQuotes,
        hasUnavailableSources: false,
      }),
    });
  });

  await page.goto("/");
  await expect.poll(() => requests).toBe(1);
  await page.clock.fastForward(5 * 60 * 1000);
  await expect.poll(() => requests).toBe(2);
});

test("the market ticker identifies partially unavailable quotes", async ({
  page,
}) => {
  await page.unroute("**/api/market-data");
  await page.route("**/api/market-data", (route) =>
    route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        quotes: marketQuotes.slice(0, 2),
        hasUnavailableSources: true,
      }),
    }),
  );

  await page.goto("/");
  await expect(
    page.getByText("Някои котировки временно не са достъпни."),
  ).toBeVisible();
  await expect(
    page
      .getByRole("region", { name: "Час и пазарни котировки" })
      .locator(".ticker-quote-label")
      .first(),
  ).toBeVisible();
});

test("the market ticker reports unavailable quotes", async ({ page }) => {
  await page.unroute("**/api/market-data");
  await page.route("**/api/market-data", (route) =>
    route.fulfill({
      status: 502,
      contentType: "application/json",
      body: JSON.stringify({ error: "В момента котировките не са достъпни." }),
    }),
  );

  await page.goto("/");
  await expect(
    page.getByRole("status").getByText("Котировките временно не са достъпни."),
  ).toBeVisible();
  await expect(
    page.getByRole("timer", { name: "Точно време в България" }),
  ).toHaveText(/^\d{2}:\d{2}:\d{2}$/);
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

test("the accounting service page lists its service areas", async ({
  page,
}) => {
  await page.goto("/uslugi/schetovodni-uslugi");

  await expect(
    page.getByRole("heading", { name: "Текущо счетоводно обслужване" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "ДДС и данъци" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Заплати и осигуряване" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "Годишно приключване и отчети",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "Фирмени регистрации и административни услуги",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Свържете се с нас" }),
  ).toHaveAttribute("href", "/kontakti");
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
    if (slug !== "schetovodni-uslugi") {
      await expect(
        page.getByText("Подготвяме подробната информация за тази услуга."),
      ).toBeVisible();
    }
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

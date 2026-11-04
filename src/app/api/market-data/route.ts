type ExchangeRatesResponse = {
  date: string;
  rates: {
    GBP: number;
    USD: number;
  };
};

type MetalPriceResponse = {
  currency: string;
  name: string;
  price: number;
  updatedAt: string;
};

type MarketQuote = {
  label: string;
  value: string;
  source: string;
};

export const dynamic = "force-dynamic";

const cacheHeaders = {
  "Cache-Control": "public, s-maxage=900, stale-while-revalidate=1800",
};

function isValidMetalPrice(value: unknown): value is MetalPriceResponse {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const price = value as Partial<MetalPriceResponse>;

  return (
    typeof price.name === "string" &&
    typeof price.price === "number" &&
    Number.isFinite(price.price) &&
    price.price > 0 &&
    price.currency === "USD" &&
    typeof price.updatedAt === "string" &&
    Number.isFinite(Date.parse(price.updatedAt))
  );
}

function isValidExchangeRates(value: unknown): value is ExchangeRatesResponse {
  if (
    typeof value !== "object" ||
    value === null ||
    !("date" in value) ||
    typeof value.date !== "string" ||
    !("rates" in value) ||
    typeof value.rates !== "object" ||
    value.rates === null ||
    !("USD" in value.rates) ||
    typeof value.rates.USD !== "number" ||
    !Number.isFinite(value.rates.USD) ||
    value.rates.USD <= 0 ||
    !("GBP" in value.rates) ||
    typeof value.rates.GBP !== "number" ||
    !Number.isFinite(value.rates.GBP) ||
    value.rates.GBP <= 0
  ) {
    return false;
  }

  return true;
}

function formatNumber(value: number, digits = 4) {
  return new Intl.NumberFormat("bg-BG", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("bg-BG", {
    timeZone: "Europe/Sofia",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(`${value}T12:00:00Z`));
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat("bg-BG", {
    timeZone: "Europe/Sofia",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

async function fetchJson(url: string, revalidate: number) {
  const response = await fetch(url, {
    next: { revalidate },
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) {
    throw new Error(`Market data provider returned HTTP ${response.status}`);
  }

  return response.json() as Promise<unknown>;
}

async function fetchBrentPrice() {
  const today = new Date();
  const start = new Date(today);
  start.setUTCDate(start.getUTCDate() - 14);

  const startDate = start.toISOString().slice(0, 10);
  const endDate = today.toISOString().slice(0, 10);
  const url = new URL("https://fred.stlouisfed.org/graph/fredgraph.csv");
  url.searchParams.set("id", "DCOILBRENTEU");
  url.searchParams.set("cosd", startDate);
  url.searchParams.set("coed", endDate);

  const response = await fetch(url, {
    next: { revalidate: 3600 },
    headers: { Accept: "text/csv" },
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) {
    throw new Error(`Brent data provider returned HTTP ${response.status}`);
  }

  const rows = (await response.text())
    .trim()
    .split(/\r?\n/)
    .slice(1)
    .map((row) => row.split(","))
    .filter(
      ([date, price]) =>
        /^\d{4}-\d{2}-\d{2}$/.test(date ?? "") &&
        Number.isFinite(Number(price)) &&
        Number(price) > 0,
    );

  const latest = rows.at(-1);
  const date = latest?.[0];
  const price = Number(latest?.[1]);

  if (!date || !Number.isFinite(price) || price <= 0) {
    throw new Error("No recent Brent price was available");
  }

  return { date, price };
}

export async function GET() {
  try {
    const [exchangeRates, goldPrice, silverPrice, brentPrice] =
      await Promise.all([
        fetchJson(
          "https://api.frankfurter.dev/v1/latest?base=EUR&symbols=USD,GBP",
          86400,
        ),
        fetchJson("https://api.gold-api.com/price/XAU", 300),
        fetchJson("https://api.gold-api.com/price/XAG", 300),
        fetchBrentPrice(),
      ]);

    if (!isValidExchangeRates(exchangeRates)) {
      throw new Error("Currency provider returned invalid exchange rates");
    }

    if (!isValidMetalPrice(goldPrice) || !isValidMetalPrice(silverPrice)) {
      throw new Error("Metals provider returned invalid price data");
    }

    const usdToEur = 1 / exchangeRates.rates.USD;
    const gbpToEur = 1 / exchangeRates.rates.GBP;
    const quotes: MarketQuote[] = [
      {
        label: "1 USD",
        value: `${formatNumber(usdToEur)} EUR`,
        source: `ЕЦБ · ${formatDate(exchangeRates.date)}`,
      },
      {
        label: "1 EUR",
        value: `${formatNumber(exchangeRates.rates.USD)} USD`,
        source: `ЕЦБ · ${formatDate(exchangeRates.date)}`,
      },
      {
        label: "1 GBP",
        value: `${formatNumber(gbpToEur)} EUR`,
        source: `ЕЦБ · ${formatDate(exchangeRates.date)}`,
      },
      {
        label: "Злато",
        value: `${formatNumber(goldPrice.price * usdToEur, 2)} EUR / тройунция`,
        source: `Gold-API ${formatTime(goldPrice.updatedAt)} · ЕЦБ ${formatDate(exchangeRates.date)}`,
      },
      {
        label: "Сребро",
        value: `${formatNumber(silverPrice.price * usdToEur, 2)} EUR / тройунция`,
        source: `Gold-API ${formatTime(silverPrice.updatedAt)} · ЕЦБ ${formatDate(exchangeRates.date)}`,
      },
      {
        label: "Брент",
        value: `${formatNumber(brentPrice.price * usdToEur, 2)} EUR / барел`,
        source: `EIA / FRED ${formatDate(brentPrice.date)} · ЕЦБ ${formatDate(exchangeRates.date)}`,
      },
    ];

    return Response.json({ quotes }, { headers: cacheHeaders });
  } catch (error) {
    console.error("Unable to load market data:", error);

    return Response.json(
      { error: "В момента котировките не са достъпни." },
      {
        status: 502,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }
}

type ExchangeRatesResponse = {
  date: string;
  rates: {
    GBP: number;
    USD: number;
  };
};

type UsdPriceResponse = {
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
  complete: {
    "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
  },
  partial: {
    "Cache-Control": "public, s-maxage=30, stale-while-revalidate=30",
  },
};

function isValidUsdPrice(value: unknown): value is UsdPriceResponse {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const price = value as Partial<UsdPriceResponse>;

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

async function loadExchangeQuotes(): Promise<MarketQuote[]> {
  const exchangeRates = await fetchJson(
    "https://api.frankfurter.dev/v1/latest?base=EUR&symbols=USD,GBP",
    86400,
  );

  if (!isValidExchangeRates(exchangeRates)) {
    throw new Error("Currency provider returned invalid exchange rates");
  }

  const gbpToUsd = exchangeRates.rates.USD / exchangeRates.rates.GBP;
  return [
    {
      label: "1 EUR",
      value: `${formatNumber(exchangeRates.rates.USD)} USD`,
      source: `ЕЦБ · ${formatDate(exchangeRates.date)}`,
    },
    {
      label: "1 GBP",
      value: `${formatNumber(gbpToUsd)} USD`,
      source: `ЕЦБ · ${formatDate(exchangeRates.date)}`,
    },
  ];
}

async function loadAssetQuote(
  url: string,
  label: string,
  unit = "",
): Promise<MarketQuote[]> {
  const value = await fetchJson(url, 300);
  if (!isValidUsdPrice(value)) {
    throw new Error(`Asset provider returned invalid ${label} price data`);
  }

  return [
    {
      label,
      value: `${formatNumber(value.price, 2)} USD${unit}`,
      source: `Gold-API · ${formatTime(value.updatedAt)}`,
    },
  ];
}

async function loadBrentQuote(): Promise<MarketQuote[]> {
  const brentPrice = await fetchBrentPrice();
  return [
    {
      label: "Брент",
      value: `${formatNumber(brentPrice.price, 2)} USD / барел`,
      source: `EIA / FRED · ${formatDate(brentPrice.date)}`,
    },
  ];
}

export async function GET() {
  const sources = [
    { name: "exchange rates", request: loadExchangeQuotes() },
    {
      name: "gold",
      request: loadAssetQuote(
        "https://api.gold-api.com/price/XAU",
        "Злато",
        " / тройунция",
      ),
    },
    {
      name: "silver",
      request: loadAssetQuote(
        "https://api.gold-api.com/price/XAG",
        "Сребро",
        " / тройунция",
      ),
    },
    {
      name: "bitcoin",
      request: loadAssetQuote("https://api.gold-api.com/price/BTC", "Биткойн"),
    },
    { name: "Brent", request: loadBrentQuote() },
  ];

  const results = await Promise.allSettled(
    sources.map(({ request }) => request),
  );
  const quotes: MarketQuote[] = [];
  let hasUnavailableSources = false;

  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      quotes.push(...result.value);
    } else {
      hasUnavailableSources = true;
      console.error(
        `Unable to load ${sources[index].name} market data:`,
        result.reason,
      );
    }
  });

  if (quotes.length === 0) {
    return Response.json(
      { error: "В момента котировките не са достъпни." },
      {
        status: 502,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }

  return Response.json(
    { quotes, hasUnavailableSources },
    {
      headers: hasUnavailableSources
        ? cacheHeaders.partial
        : cacheHeaders.complete,
    },
  );
}

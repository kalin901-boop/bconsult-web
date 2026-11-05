"use client";

import { useEffect, useState } from "react";

type MarketQuote = {
  label: string;
  value: string;
  source: string;
};

type MarketDataResponse = {
  quotes: MarketQuote[];
  hasUnavailableSources: boolean;
};

const refreshInterval = 5 * 60 * 1000;

function formatSofiaTime(date: Date) {
  return new Intl.DateTimeFormat("bg-BG", {
    timeZone: "Europe/Sofia",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);
}

function QuoteGroup({ quotes }: { quotes: MarketQuote[] }) {
  return (
    <div className="ticker-quote-group">
      {quotes.map((quote) => (
        <div className="ticker-quote" key={quote.label}>
          <span className="ticker-quote-label">{quote.label}</span>
          <strong>{quote.value}</strong>
          <span className="ticker-quote-source">{quote.source}</span>
        </div>
      ))}
    </div>
  );
}

export function MarketTicker() {
  const [now, setNow] = useState<Date | null>(null);
  const [quotes, setQuotes] = useState<MarketQuote[] | null>(null);
  const [hasError, setHasError] = useState(false);
  const [hasUnavailableSources, setHasUnavailableSources] = useState(false);
  const time = now ? formatSofiaTime(now) : "--:--:--";

  useEffect(() => {
    const updateTime = () => setNow(new Date());
    updateTime();
    const clockInterval = window.setInterval(updateTime, 1000);

    return () => window.clearInterval(clockInterval);
  }, []);

  useEffect(() => {
    let active = true;
    let loading = false;

    const loadQuotes = async () => {
      if (loading || document.visibilityState === "hidden") {
        return;
      }

      loading = true;
      try {
        const response = await fetch("/api/market-data", {
          cache: "no-store",
          signal: AbortSignal.timeout(20000),
        });
        if (!response.ok) {
          throw new Error(`Market data request failed: ${response.status}`);
        }

        const data = (await response.json()) as MarketDataResponse;
        if (
          !Array.isArray(data.quotes) ||
          typeof data.hasUnavailableSources !== "boolean" ||
          data.quotes.some(
            (quote) =>
              typeof quote.label !== "string" ||
              typeof quote.value !== "string" ||
              typeof quote.source !== "string",
          )
        ) {
          throw new Error("Market data response has an invalid shape");
        }

        if (active) {
          setQuotes(data.quotes);
          setHasUnavailableSources(data.hasUnavailableSources);
          setHasError(false);
        }
      } catch {
        if (active) {
          setHasError(true);
          setHasUnavailableSources(false);
        }
      } finally {
        loading = false;
      }
    };

    void loadQuotes();
    const interval = window.setInterval(() => {
      void loadQuotes();
    }, refreshInterval);
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void loadQuotes();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      active = false;
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <section className="market-ticker" aria-label="Час и пазарни котировки">
      <div className={`ticker-track${quotes ? " is-moving" : ""}`}>
        <div className="ticker-group">
          <div className="ticker-clock">
            <span className="ticker-clock-dot" aria-hidden="true" />
            <span>Часът в България</span>
            <time
              role="timer"
              aria-label="Точно време в България"
              dateTime={now?.toISOString()}
            >
              {time}
            </time>
          </div>
          {quotes ? (
            <QuoteGroup quotes={quotes} />
          ) : (
            <p className="ticker-status" role={hasError ? "status" : undefined}>
              {hasError
                ? "Котировките временно не са достъпни."
                : "Зареждане на котировките…"}
            </p>
          )}
        </div>
        {quotes && (
          <div className="ticker-group" aria-hidden="true">
            <div className="ticker-clock">
              <span className="ticker-clock-dot" />
              <span>Часът в България</span>
              <time dateTime={now?.toISOString()}>{time}</time>
            </div>
            <QuoteGroup quotes={quotes} />
          </div>
        )}
      </div>
      <p
        className="ticker-disclaimer"
        role={
          hasUnavailableSources || (hasError && quotes) ? "status" : undefined
        }
      >
        {hasUnavailableSources
          ? "Някои котировки временно не са достъпни. "
          : hasError && quotes
            ? "Обновяването не успя; показани са последните получени котировки. "
            : ""}
        Лентата проверява за обновяване на всеки 5 минути; котировките са
        информативни и носят дата/час от източника.
      </p>
    </section>
  );
}

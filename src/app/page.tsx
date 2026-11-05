import { MarketTicker } from "@/components/market-ticker";

export default function HomePage() {
  return (
    <>
      <MarketTicker />
      <main id="main-content" className="landing shell" tabIndex={-1}>
        <div className="hero-copy">
          <p className="eyebrow">С грижа за вашия бизнес</p>
          <h1>
            Очаквайте скоро
            <br />
            <span>Б-Консулт</span>
          </h1>
          <p className="hero-description">
            Вие гледате напред. Ние се грижим за важните детайли.
          </p>
        </div>
        <aside className="hero-art" aria-label="Основни направления">
          <div className="hero-card">
            <div className="hero-card-heading">
              <span className="hero-card-mark" aria-hidden="true">
                БК
              </span>
              <p>Б-Консулт</p>
            </div>
            <h2>Основни направления</h2>
            <ul className="hero-card-services">
              <li>
                <span className="service-check" aria-hidden="true">
                  ✓
                </span>
                Счетоводни услуги
              </li>
              <li>
                <span className="service-check" aria-hidden="true">
                  ✓
                </span>
                Административни услуги
              </li>
              <li>
                <span className="service-check" aria-hidden="true">
                  ✓
                </span>
                Застраховки
              </li>
            </ul>
            <div className="hero-card-accent" aria-hidden="true">
              <span />
            </div>
          </div>
        </aside>
      </main>
    </>
  );
}

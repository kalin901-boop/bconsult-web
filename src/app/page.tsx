import type { Metadata } from "next";
import Link from "next/link";

import { MarketTicker } from "@/components/market-ticker";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Счетоводни и административни услуги в Кирково | Б-Консулт",
  description:
    "Счетоводно обслужване, административно съдействие и услуги за бизнеса и физически лица в Кирково. Свържете се с Б-Консулт.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Счетоводни и административни услуги в Кирково | Б-Консулт",
    description:
      "Счетоводно обслужване, административно съдействие и услуги за бизнеса и физически лица в Кирково.",
    url: site.url,
  },
};

export default function HomePage() {
  return (
    <>
      <MarketTicker />
      <main id="main-content" className="landing shell" tabIndex={-1}>
        <div className="hero-copy">
          <p className="eyebrow">С грижа за вашия бизнес</p>
          <h1>
            Счетоводни и административни услуги
            <br />
            <span>Б-Консулт</span>
          </h1>
          <p className="hero-description">
            Вие гледате напред. Ние се грижим за важните детайли.
          </p>
          <Link className="home-link hero-contact-link" href="/kontakti">
            Свържете се с нас <span aria-hidden="true">↗</span>
          </Link>
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
                <Link href="/uslugi/schetovodni-uslugi">Счетоводни услуги</Link>
              </li>
              <li>
                <span className="service-check" aria-hidden="true">
                  ✓
                </span>
                <Link href="/uslugi/administrativni-uslugi">
                  Административни услуги
                </Link>
              </li>
              <li>
                <span className="service-check" aria-hidden="true">
                  ✓
                </span>
                <Link href="/uslugi/zastrahovki">Застраховки</Link>
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

export default function HomePage() {
  return (
    <main id="main-content" className="landing shell" tabIndex={-1}>
      <div className="hero-copy">
        <p className="eyebrow">С грижа за важните неща</p>
        <h1>
          Очаквайте скоро
          <br />
          <span>Б-Консулт</span>
        </h1>
        <p className="hero-description">
          Счетоводство, застраховки и съдействие с административните въпроси — с
          внимание към вас и спокойствие за всеки следващ ден.
        </p>
        <ul className="services" aria-label="Нашите направления">
          <li>Счетоводни услуги</li>
          <li>Застраховки</li>
          <li>Административно съдействие</li>
          <li>И още много други</li>
        </ul>
        <p className="coming-soon-note">Подготвяме нашия нов сайт. До скоро!</p>
      </div>
      <div className="hero-art" aria-hidden="true">
        <span className="art-circle" />
        <span className="art-arch" />
        <span className="art-square" />
      </div>
    </main>
  );
}

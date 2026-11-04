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
          Счетоводни и административни услуги, съдействие пред държавни
          институции, проекти, регистрации, застраховки и документи за
          пенсиониране.
        </p>
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

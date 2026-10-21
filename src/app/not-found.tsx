import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main-content" className="not-found shell" tabIndex={-1}>
      <p className="eyebrow">Грешка 404</p>
      <h1>Тази страница липсва.</h1>
      <p className="hero-description">
        Адресът може да е променен или страницата да не съществува.
      </p>
      <Link className="home-link" href="/">
        Към началната страница <span aria-hidden="true">↗</span>
      </Link>
    </main>
  );
}

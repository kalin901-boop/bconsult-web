import type { Metadata } from "next";

import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Контакти",
  description: `Свържете се с ${site.name} по телефон или имейл.`,
  alternates: {
    canonical: "/kontakti",
  },
  openGraph: {
    title: `Контакти | ${site.name}`,
    description: `Свържете се с ${site.name} по телефон или имейл.`,
    url: `${site.url}/kontakti`,
  },
};

export default function ContactsPage() {
  return (
    <main id="main-content" className="contact-page shell" tabIndex={-1}>
      <p className="eyebrow">Свържете се с нас</p>
      <h1>Контакти</h1>
      <div className="contact-grid">
        <section className="contact-card" aria-labelledby="contact-mariyana">
          <h2 id="contact-mariyana">Марияна</h2>
          <a className="contact-action" href="tel:+359882961650">
            Обади се: 0882961650
          </a>
        </section>
        <section className="contact-card" aria-labelledby="contact-kalin">
          <h2 id="contact-kalin">Калин</h2>
          <a className="contact-action" href="tel:+359887807097">
            Обади се: 0887807097
          </a>
        </section>
        <section className="contact-card" aria-labelledby="contact-email">
          <h2 id="contact-email">Имейл</h2>
          <a className="contact-action" href="mailto:office@bonev-consult.bg">
            Изпрати имейл
          </a>
        </section>
        <section className="contact-card" aria-labelledby="contact-address">
          <h2 id="contact-address">Адрес</h2>
          <address>Кирково, ул. „Дружба“ 2</address>
          <a
            className="contact-action"
            href="https://www.google.com/maps/search/?api=1&query=Кирково%2C%20ул.%20%22Дружба%22%202"
            target="_blank"
            rel="noreferrer"
          >
            Отвори в Google Maps
          </a>
        </section>
        <section className="contact-card" aria-labelledby="contact-hours">
          <h2 id="contact-hours">Работно време</h2>
          <dl className="contact-hours">
            <div>
              <dt>Понеделник–събота</dt>
              <dd>09:00–13:00 и 14:00–18:00</dd>
            </div>
            <div>
              <dt>Неделя</dt>
              <dd>Почивен ден</dd>
            </div>
          </dl>
        </section>
      </div>
    </main>
  );
}

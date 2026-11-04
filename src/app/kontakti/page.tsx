import type { Metadata } from "next";

import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `Контакти | ${site.name}`,
  description: `Свържете се с ${site.name} по телефон или имейл.`,
};

export default function ContactsPage() {
  return (
    <main id="main-content" className="contact-page shell" tabIndex={-1}>
      <p className="eyebrow">Свържете се с нас</p>
      <h1>Контакти</h1>
      <div className="contact-grid">
        <section className="contact-card" aria-labelledby="contact-mariyana">
          <h2 id="contact-mariyana">Марияна</h2>
          <a href="tel:+359882961650">0882961650</a>
        </section>
        <section className="contact-card" aria-labelledby="contact-kalin">
          <h2 id="contact-kalin">Калин</h2>
          <a href="tel:+359887807097">0887807097</a>
        </section>
        <section className="contact-card" aria-labelledby="contact-email">
          <h2 id="contact-email">Имейл</h2>
          <a href="mailto:office@bonev-consult.bg">office@bonev-consult.bg</a>
        </section>
        <section className="contact-card" aria-labelledby="contact-address">
          <h2 id="contact-address">Адрес</h2>
          <address>Кирково, ул. „Дружба“ 2</address>
        </section>
      </div>
    </main>
  );
}

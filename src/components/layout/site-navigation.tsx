"use client";

import Link from "next/link";

import { perfumeCategories } from "@/lib/perfume-categories";
import { services } from "@/lib/services";

function closeMenus() {
  document
    .querySelectorAll(".site-header details[open]")
    .forEach((details) => details.removeAttribute("open"));
}

function ServiceLinks() {
  return (
    <ul className="dropdown-menu-list">
      {services.map((service) => (
        <li key={service.slug}>
          <Link href={`/uslugi/${service.slug}`} onClick={closeMenus}>
            {service.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function PerfumeLinks() {
  return (
    <ul className="dropdown-menu-list">
      {perfumeCategories.map((category) => (
        <li key={category.slug}>
          <Link href={`/magazin/${category.slug}`} onClick={closeMenus}>
            {category.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function SiteNavigation() {
  return (
    <>
      <nav className="desktop-navigation" aria-label="Основна навигация">
        <Link className="navigation-home" href="/" onClick={closeMenus}>
          Начало
        </Link>
        <details className="desktop-dropdown-menu">
          <summary>Услуги</summary>
          <ServiceLinks />
        </details>
        <details className="desktop-dropdown-menu">
          <summary>Магазин</summary>
          <PerfumeLinks />
        </details>
        <Link href="/kontakti" onClick={closeMenus}>
          Контакти
        </Link>
      </nav>
      <div className="mobile-header-navigation">
        <nav className="mobile-store-navigation" aria-label="Магазин">
          <details className="mobile-store-dropdown">
            <summary>Магазин</summary>
            <PerfumeLinks />
          </details>
        </nav>
        <details className="mobile-navigation">
          <summary>
            <span className="menu-icon" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
            Меню
          </summary>
          <nav className="mobile-menu-panel" aria-label="Основна навигация">
            <Link href="/" onClick={closeMenus}>
              Начало
            </Link>
            <details className="mobile-dropdown-menu">
              <summary>Услуги</summary>
              <ServiceLinks />
            </details>
            <Link href="/kontakti" onClick={closeMenus}>
              Контакти
            </Link>
          </nav>
        </details>
      </div>
    </>
  );
}

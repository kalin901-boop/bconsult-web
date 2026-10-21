import Link from "next/link";

import { site } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="site-header shell">
      <Link className="brand" href="/" aria-label={`${site.name} — начало`}>
        <span className="brand-mark" aria-hidden="true">
          b.
        </span>
        <span>{site.name}</span>
      </Link>
      <span className="header-note">Ново начало</span>
    </header>
  );
}

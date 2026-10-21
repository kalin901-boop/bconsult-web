import { CurrentHostname } from "@/components/current-hostname";
import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="site-footer shell">
      <p className="footer-signature">© {site.name}</p>
      <dl className="domain-details">
        <dt>Текущ домейн</dt>
        <dd>
          <CurrentHostname />
        </dd>
      </dl>
    </footer>
  );
}

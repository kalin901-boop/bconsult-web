import Image from "next/image";
import Link from "next/link";

import { SiteNavigation } from "@/components/layout/site-navigation";
import { site } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header-inner shell">
        <Link className="brand" href="/" aria-label={`${site.name} — начало`}>
          <Image
            className="brand-logo"
            src="/b-consult-logo.png"
            alt={`${site.name} — лого`}
            width={607}
            height={550}
            sizes="(max-width: 48rem) 8rem, 9.75rem"
          />
        </Link>
        <SiteNavigation />
      </div>
    </header>
  );
}

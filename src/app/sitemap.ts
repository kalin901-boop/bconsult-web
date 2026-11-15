import type { MetadataRoute } from "next";

import { perfumeCategories } from "@/lib/perfume-categories";
import { services } from "@/lib/services";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url },
    { url: `${site.url}/kontakti` },
    ...perfumeCategories.map(({ slug }) => ({
      url: `${site.url}/magazin/${slug}`,
    })),
    ...services.map(({ slug }) => ({
      url: `${site.url}/uslugi/${slug}`,
    })),
  ];
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { perfumeCategories } from "@/lib/perfume-categories";
import { site } from "@/lib/site";

type CategoryPageProps = {
  params: Promise<{ category: string }>;
};

function getCategory(slug: string) {
  return perfumeCategories.find((category) => category.slug === slug);
}

export function generateStaticParams() {
  return perfumeCategories.map(({ slug }) => ({ category: slug }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategory(slug);

  if (!category) {
    return { title: "Магазин" };
  }

  return {
    title: category.title,
    description: `Каталогът с ${category.title.toLowerCase()} се подготвя. Попитайте за наличности в WhatsApp.`,
    alternates: {
      canonical: `/magazin/${category.slug}`,
    },
    openGraph: {
      title: `${category.title} | ${site.name}`,
      description: `${category.title} — попитайте за наличност в WhatsApp.`,
      url: `${site.url}/magazin/${category.slug}`,
    },
  };
}

export default async function PerfumeCategoryPage({
  params,
}: CategoryPageProps) {
  const { category: slug } = await params;
  const category = getCategory(slug);

  if (!category) {
    notFound();
  }

  const message = encodeURIComponent(
    `Здравейте, интересувам се от ${category.title.toLowerCase()}.`,
  );

  return (
    <main id="main-content" className="service-page shell" tabIndex={-1}>
      <p className="eyebrow">Магазин</p>
      <h1>{category.title}</h1>
      <p className="service-intro">
        Каталогът се подготвя. Свържете се с нас в WhatsApp, за да попитате за
        наличните аромати.
      </p>
      <a
        className="home-link"
        href={`https://wa.me/359887807097?text=${message}`}
        target="_blank"
        rel="noreferrer"
      >
        Попитайте в WhatsApp <span aria-hidden="true">↗</span>
      </a>
    </main>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { perfumeCategories } from "@/lib/perfume-categories";
import { perfumesByCategory } from "@/lib/perfumes";
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
    description: `Разгледайте ароматите YODEYMA от каталога с ${category.title.toLowerCase()} в разфасовки 50 мл и 100 мл.`,
    alternates: {
      canonical: `/magazin/${category.slug}`,
    },
    openGraph: {
      title: `${category.title} | ${site.name}`,
      description: `${category.title} от YODEYMA — запитвания за наличност в WhatsApp.`,
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

  const perfumes = perfumesByCategory[category.slug];

  return (
    <main id="main-content" className="service-page shell" tabIndex={-1}>
      <p className="eyebrow">Магазин</p>
      <h1>{category.title}</h1>
      {perfumes.map((perfume) => (
        <section className="perfume-product" key={perfume.slug}>
          <h2>{perfume.name}</h2>
          <p className="service-intro">{perfume.description}</p>
          <dl className="perfume-notes">
            {perfume.notes.map((note) => (
              <div key={note.label}>
                <dt>{note.label}</dt>
                <dd>{note.value}</dd>
              </div>
            ))}
          </dl>
          <div className="perfume-grid">
            {perfume.variants.map((variant) => {
              const size = `${variant.size} мл`;
              const message = encodeURIComponent(
                `Здравейте, интересувам се от YODEYMA ${perfume.name}, ${size}.`,
              );

              return (
                <article className="perfume-card" key={variant.size}>
                  <div className="perfume-image-frame">
                    <Image
                      className="perfume-image"
                      src={variant.image}
                      alt={`Флакон YODEYMA ${perfume.name}, ${size}`}
                      width={800}
                      height={800}
                      sizes="(max-width: 48rem) 100vw, 35rem"
                    />
                  </div>
                  <div className="perfume-card-content">
                    <p className="eyebrow">YODEYMA</p>
                    <p className="perfume-size">Eau de Parfum · {size}</p>
                    <p className="perfume-price">{variant.price}</p>
                    {variant.availabilityNote ? (
                      <p className="perfume-availability">
                        {variant.availabilityNote}
                      </p>
                    ) : null}
                    <a
                      className="home-link"
                      href={`https://wa.me/359887807097?text=${message}`}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Запитване за YODEYMA ${perfume.name}, ${size} в WhatsApp`}
                    >
                      Запитване в WhatsApp <span aria-hidden="true">↗</span>
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ))}
    </main>
  );
}

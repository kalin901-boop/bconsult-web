import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { perfumeCategories } from "@/lib/perfume-categories";
import { site } from "@/lib/site";

const adriana = {
  description:
    "Плодовият аромат на касиса и прасковата се съчетава с топла ванилова основа. Шипрово-плодов профил за модерно и женствено излъчване.",
  notes: [
    { label: "Връхна нотка", value: "Касис" },
    { label: "Сърдечна нотка", value: "Праскова" },
    { label: "Основна нотка", value: "Ванилия" },
  ],
  variants: [
    {
      size: "50 мл",
      price: "19,00 €",
      image: "/products/yodeyma-adriana-50ml.jpg",
    },
    {
      size: "100 мл",
      price: "29,75 €",
      image: "/products/yodeyma-adriana-100ml.jpg",
    },
  ],
} as const;

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
    description:
      slug === "damski"
        ? "YODEYMA Adriana — дамски Eau de Parfum в разфасовки 50 мл и 100 мл."
        : `Каталогът с ${category.title.toLowerCase()} се подготвя. Попитайте за наличности в WhatsApp.`,
    alternates: {
      canonical: `/magazin/${category.slug}`,
    },
    openGraph: {
      title: `${category.title} | ${site.name}`,
      description:
        slug === "damski"
          ? "YODEYMA Adriana — дамски Eau de Parfum в разфасовки 50 мл и 100 мл."
          : `${category.title} — попитайте за наличност в WhatsApp.`,
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

  if (slug === "damski") {
    return (
      <main id="main-content" className="service-page shell" tabIndex={-1}>
        <p className="eyebrow">Магазин</p>
        <h1>{category.title}</h1>
        <p className="service-intro">{adriana.description}</p>
        <dl className="perfume-notes">
          {adriana.notes.map((note) => (
            <div key={note.label}>
              <dt>{note.label}</dt>
              <dd>{note.value}</dd>
            </div>
          ))}
        </dl>
        <div className="perfume-grid">
          {adriana.variants.map((variant) => {
            const message = encodeURIComponent(
              `Здравейте, интересувам се от YODEYMA Adriana, ${variant.size}.`,
            );

            return (
              <article className="perfume-card" key={variant.size}>
                <div className="perfume-image-frame">
                  <Image
                    className="perfume-image"
                    src={variant.image}
                    alt={`Флакон YODEYMA Adriana, ${variant.size}`}
                    width={800}
                    height={800}
                    sizes="(max-width: 48rem) 100vw, 35rem"
                  />
                </div>
                <div className="perfume-card-content">
                  <p className="eyebrow">YODEYMA</p>
                  <h2>Adriana</h2>
                  <p className="perfume-size">Eau de Parfum · {variant.size}</p>
                  <p className="perfume-price">{variant.price}</p>
                  <a
                    className="home-link"
                    href={`https://wa.me/359887807097?text=${message}`}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Запитване за YODEYMA Adriana, ${variant.size} в WhatsApp`}
                  >
                    Запитване в WhatsApp <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </main>
    );
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

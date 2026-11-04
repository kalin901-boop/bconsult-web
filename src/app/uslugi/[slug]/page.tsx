import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { services } from "@/lib/services";
import { site } from "@/lib/site";

type ServicePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return services.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);

  if (!service) {
    return { title: `Услуги | ${site.name}` };
  }

  return {
    title: `${service.title} | ${site.name}`,
    description: `${service.title} от ${site.name}.`,
  };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);

  if (!service) {
    notFound();
  }

  return (
    <main id="main-content" className="service-page shell" tabIndex={-1}>
      <p className="eyebrow">Услуги на Б-Консулт</p>
      <h1>{service.title}</h1>
      <p className="hero-description">
        Подготвяме подробната информация за тази услуга. Скоро ще добавим повече
        информация.
      </p>
      <Link className="home-link" href="/">
        Към началната страница <span aria-hidden="true">↗</span>
      </Link>
    </main>
  );
}

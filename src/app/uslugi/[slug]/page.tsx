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
    description:
      slug === "schetovodni-uslugi"
        ? `Счетоводно обслужване, ДДС и данъци, заплати, годишно приключване и консултации от ${site.name}.`
        : `${service.title} от ${site.name}.`,
  };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);

  if (!service) {
    notFound();
  }

  if (slug === "schetovodni-uslugi") {
    return (
      <main id="main-content" className="service-page shell" tabIndex={-1}>
        <p className="eyebrow">Услуги на Б-Консулт</p>
        <h1>{service.title}</h1>
        <p className="service-intro">
          Счетоводно обслужване и съдействие, съобразени с дейността и нуждите
          на вашия бизнес — от текущото отчитане до годишното приключване.
        </p>
        <div className="service-grid">
          <section className="service-card">
            <h2>Текущо счетоводно обслужване</h2>
            <p>
              Обработка на първични счетоводни документи и текущо отчитане на
              стопанските операции. Подреждаме информацията, необходима за
              проследяване на дейността и подготовка на отчетите.
            </p>
          </section>
          <section className="service-card">
            <h2>ДДС и данъци</h2>
            <p>
              Съдействие при регистрация и дерегистрация по ЗДДС, текуща
              подготовка на справки и декларации и изпълнение на данъчните
              задължения според приложимите изисквания.
            </p>
          </section>
          <section className="service-card">
            <h2>Заплати и осигуряване</h2>
            <p>
              Обработка на информация за възнаграждения и осигуровки, подготовка
              на ведомости и необходимите декларации и съдействие по текущи
              въпроси, свързани с персонала.
            </p>
          </section>
          <section className="service-card">
            <h2>Годишно приключване и отчети</h2>
            <p>
              Подготовка за годишното счетоводно приключване, годишни финансови
              отчети и свързаните с дейността годишни данъчни и статистически
              декларации и справки, когато са приложими.
            </p>
          </section>
          <section className="service-card">
            <h2>Консултации и съдействие пред институции</h2>
            <p>
              Обсъждане на счетоводни, данъчни и осигурителни въпроси, както и
              съдействие при подготовка на документи и комуникация с
              компетентните институции.
            </p>
          </section>
          <section className="service-card">
            <h2>Самоосигуряващи се и свободни професии</h2>
            <p>
              Счетоводно и данъчно съдействие за самоосигуряващи се лица и
              упражняващи свободни професии, съобразено с конкретния начин на
              работа и приложимия режим.
            </p>
          </section>
          <section className="service-card">
            <h2>Земеделски стопани и организации с нестопанска цел</h2>
            <p>
              Счетоводно обслужване и консултации според особеностите на
              дейността, отчетността и задълженията на земеделски стопани и
              организации с нестопанска цел.
            </p>
          </section>
          <section className="service-card">
            <h2>Фирмени регистрации и административни услуги</h2>
            <p>
              Съдействие при регистрация на фирма и свързани административни
              стъпки, както и насоки за текущите счетоводни и данъчни задължения
              след започване на дейността.
            </p>
          </section>
        </div>
        <p className="service-note">
          Конкретният обхват на обслужването се уточнява според вида дейност и
          индивидуалните нужди.
        </p>
        <Link className="home-link" href="/kontakti">
          Свържете се с нас <span aria-hidden="true">↗</span>
        </Link>
      </main>
    );
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

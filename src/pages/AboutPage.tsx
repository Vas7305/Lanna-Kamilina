import { useSeo } from '@/hooks/useSeo';
import { breadcrumbSchema, localBusinessSchema } from '@/lib/seo';
import { routes } from '@/lib/routes';
import { business, reputation, specialists, yearsInBusiness } from '@/data';
import { formatYears } from '@/lib/format';
import { useDeclareCta } from '@/app/CtaContext';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { SectionHeader } from '@/components/Typo';
import { TextLink } from '@/components/Button';
import { ExperienceSection, HeritageSection } from '@/sections/Story';
import { ReputationStrip } from '@/features/reviews/Reviews';
import { SpecialistCard } from '@/features/specialists/SpecialistCard';
import { Figure } from '@/components/Figure';

/**
 * About.
 *
 * Reuses the homepage heritage and experience sections rather than restating
 * them in different words — one narrative, one place to edit it.
 */
export function AboutPage() {
  useSeo({
    title: `О салоне — Lanna Kamilina, ${formatYears(yearsInBusiness)} в центре Москвы`,
    description: `Салон красоты Lanna Kamilina работает в центре Москвы с ${business.foundedYear} года. Команда мастеров, подход к работе, стандарты консультации и запись онлайн.`,
    path: routes.about,
    jsonLd: [
      localBusinessSchema(business, reputation),
      breadcrumbSchema([
        { name: 'Главная', path: routes.home },
        { name: 'О нас', path: routes.about },
      ]),
    ],
  });

  useDeclareCta({ label: 'Записаться', from: 'about-sticky' });

  return (
    <div>
      <div className="shell section-y-tight">
        <Breadcrumbs
          items={[{ name: 'Главная', path: routes.home }, { name: 'О нас' }]}
          className="mb-8"
        />

        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <SectionHeader
              eyebrow="О салоне"
              as="h1"
              title="Опыт, который можно проверить"
              lead={`Салон работает в центре Москвы с ${business.foundedYear} года. За это время сменились поколения техник и материалов — не изменилось одно: мастер обязан объяснить, что получится, до того, как начнёт работу.`}
            />
            <p className="type-body mt-8 max-w-xl text-ink-2">
              Мы не обещаем «преображение». Мы говорим, за сколько визитов реально прийти к
              нужному цвету, сколько времени займёт укладка утром и какой уход нужен дома,
              чтобы результат держался. Это скучнее рекламы — и надёжнее.
            </p>
          </div>

          <div className="lg:col-span-6">
            <Figure
              image={{ alt: 'Салон Lanna Kamilina', seed: 'about-salon' }}
              ratio="landscape"
              priority
              className="grain"
            />
          </div>
        </div>

        <ReputationStrip className="mt-16" />
      </div>

      <HeritageSection />
      <ExperienceSection />

      <section className="section-y-tight">
        <div className="shell">
          <div className="flex items-end justify-between gap-6">
            <h2 className="type-title">Команда</h2>
            <TextLink to={routes.specialists}>Все мастера</TextLink>
          </div>
          <div className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {specialists.slice(0, 3).map((specialist) => (
              <SpecialistCard key={specialist.id} specialist={specialist} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

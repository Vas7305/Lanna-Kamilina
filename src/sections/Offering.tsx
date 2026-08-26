import { Link } from '@/components/AppLink';
import { routes } from '@/lib/routes';
import { track } from '@/lib/analytics';
import { formatPrice } from '@/lib/format';
import { getServicesByCategory, serviceCategories, specialists } from '@/data';
import { SectionHeader } from '@/components/Typo';
import { TextLink, ArrowRight } from '@/components/Button';
import { Figure, Scrim } from '@/components/Figure';
import { Reveal } from '@/components/Reveal';
import { Rail } from '@/components/Rail';
import { SpecialistCard } from '@/features/specialists/SpecialistCard';

/**
 * Services on the homepage.
 *
 * Organised by intent — what someone wants to change — with the cheapest real
 * entry price on every tile. A visitor should be able to answer "can I afford
 * this?" without opening a single page.
 */
export function ServicesSection() {
  return (
    <section className="section-y" aria-labelledby="services-heading">
      <div className="shell">
        <SectionHeader
          eyebrow="Услуги"
          title="С чего начать"
          lead="Шесть направлений. Внутри каждого — описание, цена, длительность и мастера, которые это делают."
          action={<TextLink to={routes.services}>Все услуги и цены</TextLink>}
        />

        <div className="mt-12 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
          {serviceCategories.map((category, index) => {
            const items = getServicesByCategory(category.id);
            const cheapest = items.reduce<number | null>(
              (min, service) => (min === null ? service.price.from : Math.min(min, service.price.from)),
              null,
            );

            return (
              <Reveal key={category.id} delay={(index % 3) * 60}>
                <Link
                  to={routes.serviceCategory(category.slug)}
                  onClick={() => track('service_viewed', { category: category.slug, surface: 'home' })}
                  className="group flex h-full flex-col bg-paper p-7 transition-colors duration-300 hover:bg-paper-2/60"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="type-title">{category.title}</h3>
                      <p className="type-meta mt-2 text-accent uppercase">{category.intent}</p>
                    </div>
                    <ArrowRight className="mt-2 shrink-0 text-muted transition-transform duration-300 group-hover:translate-x-1 group-hover:text-ink" />
                  </div>

                  <p className="type-small mt-5 flex-1 text-muted">{category.description}</p>

                  <p className="type-small numeric mt-6 border-t border-line pt-4">
                    {items.length} услуг
                    {cheapest !== null && (
                      <span className="text-muted">
                        {' '}
                        · {formatPrice({ from: cheapest, exact: false })}
                      </span>
                    )}
                  </p>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/**
 * Specialists.
 *
 * The salon's real assets. Shown as a rail rather than a grid so the team
 * reads as a group of people, and every card offers "работы" before
 * "записаться" — proof precedes the ask.
 */
export function SpecialistsSection() {
  return (
    <section className="section-y bg-paper-2/70" aria-labelledby="specialists-heading">
      <div className="shell">
        <SectionHeader
          eyebrow="Мастера"
          title="Кто будет с вами работать"
          lead="Можно выбрать мастера — или не выбирать. «Без предпочтения» работает так же хорошо и обычно даёт больше свободного времени."
          action={<TextLink to={routes.specialists}>Вся команда</TextLink>}
        />

        <div className="mt-12">
          <Rail ariaLabel="Мастера салона">
            {specialists.map((specialist, index) => (
              <div key={specialist.id} className="w-[72vw] max-w-[20rem] sm:w-[18rem]">
                <SpecialistCard specialist={specialist} priority={index < 2} />
              </div>
            ))}
          </Rail>
        </div>
      </div>
    </section>
  );
}

/**
 * Occasion entry points.
 *
 * A wedding or a shoot is a different purchase from a haircut: higher value,
 * longer planning, and usually searched for by the occasion rather than by the
 * service. These land directly on the relevant page.
 */
export function OccasionsSection() {
  const occasions = [
    {
      title: 'Свадьба',
      body: 'Репетиция образа заранее, макияж и причёска в день события.',
      to: routes.service('svadebnyy-obraz'),
      seed: 'occ-wedding',
    },
    {
      title: 'Фотосессия',
      body: 'Макияж под свет и камеру, смена образов внутри съёмочного дня.',
      to: routes.service('obraz-dlya-fotosessii'),
      seed: 'occ-photo',
    },
    {
      title: 'Вечер',
      body: 'Макияж и укладка за один визит — можно приехать перед событием.',
      to: routes.service('vecherniy-obraz'),
      seed: 'occ-evening',
    },
  ];

  return (
    <section className="section-y" aria-labelledby="occasions-heading">
      <div className="shell">
        <SectionHeader eyebrow="Особые случаи" title="Когда день важный" />

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {occasions.map((occasion, index) => (
            <Reveal key={occasion.title} delay={index * 70}>
              <Link to={occasion.to} className="group block">
                <Figure
                  image={{ alt: occasion.title, seed: occasion.seed }}
                  ratio="portrait"
                  hoverZoom
                >
                  <Scrim />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <h3 className="type-title text-paper">{occasion.title}</h3>
                    <p className="type-small mt-2 max-w-xs text-paper/80">{occasion.body}</p>
                    <span className="type-small mt-4 inline-flex items-center gap-2 text-paper">
                      Подробнее
                      <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </div>
                </Figure>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

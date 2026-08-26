import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { Service } from '@/types';
import { useSeo } from '@/hooks/useSeo';
import { breadcrumbSchema, serviceSchema } from '@/lib/seo';
import { bookingLink, routes, worksLink } from '@/lib/routes';
import { track } from '@/lib/analytics';
import { formatDuration } from '@/lib/format';
import {
  business,
  getCategory,
  getPortfolioForService,
  getRelatedServices,
  getReviewsForService,
  getServiceBySlug,
  getSpecialistsForService,
} from '@/data';
import { useDeclareCta } from '@/app/CtaContext';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ButtonLink, TextLink } from '@/components/Button';
import { Figure } from '@/components/Figure';
import { Eyebrow } from '@/components/Typo';
import { DurationTag, PriceTag } from '@/components/Meta';
import { PortfolioCard } from '@/features/portfolio/PortfolioCard';
import { SpecialistCard } from '@/features/specialists/SpecialistCard';
import { ReviewList } from '@/features/reviews/Reviews';
import { NotFoundPage } from './NotFoundPage';

/**
 * Service detail.
 *
 * Answers the five questions that decide a booking, in order: what is this,
 * what does it cost and why, what does it look like, who does it, when is
 * there time. Reviews sit next to the specialists rather than at the bottom,
 * because that is the moment the doubt appears.
 */
export function ServicePage() {
  const { slug = '' } = useParams();
  const service = getServiceBySlug(slug);

  if (!service) return <NotFoundPage />;
  return <ServiceDetail key={service.id} service={service} />;
}

function ServiceDetail({ service }: { service: Service }) {
  const category = getCategory(service.categoryId);
  const specialists = getSpecialistsForService(service.id);
  const results = getPortfolioForService(service.id, 4);
  const reviews = getReviewsForService(service.id, 2);
  const related = getRelatedServices(service, 3);

  useSeo({
    title: service.seo?.title ?? `${service.title} в Москве — цена и запись | Lanna Kamilina`,
    description:
      service.seo?.description ??
      `${service.title}: ${service.outcome.toLowerCase()}. ${service.description.slice(0, 110)}… Цена, длительность, работы мастеров и запись онлайн в центре Москвы.`,
    path: routes.service(service.slug),
    jsonLd: [
      serviceSchema(service, business),
      breadcrumbSchema([
        { name: 'Главная', path: routes.home },
        { name: 'Услуги', path: routes.services },
        { name: service.title, path: routes.service(service.slug) },
      ]),
    ],
  });

  // Price visibility is a funnel step in its own right: knowing how many
  // people saw a price and did not book is what makes the number tunable.
  useEffect(() => {
    track('price_viewed', { service: service.slug, price_from: service.price.from });
  }, [service.slug, service.price.from]);

  useDeclareCta({
    label: service.title,
    detail: `${formatDuration(service.duration)} · ${service.price.exact ? '' : 'от '}${service.price.from.toLocaleString('ru-RU')} ₽`,
    serviceSlug: service.slug,
    from: 'service-sticky',
  });

  return (
    <article>
      <div className="shell section-y-tight">
        <Breadcrumbs
          items={[
            { name: 'Главная', path: routes.home },
            { name: 'Услуги', path: routes.services },
            ...(category ? [{ name: category.title, path: routes.serviceCategory(category.slug) }] : []),
            { name: service.title },
          ]}
          className="mb-8"
        />

        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            {category && <Eyebrow>{category.title}</Eyebrow>}
            <h1 className="type-hero mt-4">{service.title}</h1>
            <p className="type-lead mt-6 max-w-lg">{service.outcome}</p>

            <div className="mt-10 flex flex-wrap items-end gap-x-10 gap-y-5 border-y border-line py-6">
              <div>
                <p className="type-eyebrow mb-2 text-muted">Стоимость</p>
                <PriceTag price={service.price} size="lg" />
              </div>
              <div>
                <p className="type-eyebrow mb-2 text-muted">Длительность</p>
                <DurationTag duration={service.duration} className="text-ink" />
              </div>
            </div>

            {service.price.factors?.length ? (
              <p className="type-small mt-4 text-muted">
                Стоимость зависит от: {service.price.factors.join(', ').toLowerCase()}. Точную
                сумму мастер называет на консультации, до начала работы.
              </p>
            ) : null}

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink
                to={bookingLink({ service: service.slug, from: 'service-detail' })}
                size="lg"
                onClick={() => track('booking_started', { from: 'service-detail', service: service.slug })}
              >
                Посмотреть свободное время
              </ButtonLink>
              <ButtonLink
                to={worksLink({ service: service.slug })}
                variant="secondary"
                size="lg"
              >
                Работы по этой услуге
              </ButtonLink>
            </div>
          </div>

          <div className="lg:col-span-6">
            <Figure image={service.image} ratio="landscape" priority className="grain" />

            <div className="mt-8">
              <p className="type-body text-ink-2">{service.description}</p>

              {service.includes?.length ? (
                <div className="mt-8">
                  <Eyebrow className="mb-4">Как проходит визит</Eyebrow>
                  <ol className="flex flex-col">
                    {service.includes.map((step, index) => (
                      <li
                        key={step}
                        className="grid grid-cols-[2rem_1fr] gap-4 border-b border-line py-3.5"
                      >
                        <span className="numeric type-meta pt-1 text-accent">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className="type-small">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {results.length > 0 && (
        <section className="section-y-tight bg-paper-2/70">
          <div className="shell">
            <div className="flex items-end justify-between gap-6">
              <h2 className="type-title">Результаты</h2>
              <TextLink to={worksLink({ service: service.slug })}>Все работы</TextLink>
            </div>
            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {results.map((item) => (
                <PortfolioCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </section>
      )}

      {specialists.length > 0 && (
        <section className="section-y-tight">
          <div className="shell">
            <div className="flex items-end justify-between gap-6">
              <h2 className="type-title">Кто выполняет</h2>
              <TextLink to={routes.specialists}>Все мастера</TextLink>
            </div>
            <p className="type-small mt-3 max-w-xl text-muted">
              Можно выбрать мастера или записаться без предпочтения — услуга выполняется
              одинаково, различается только расписание.
            </p>

            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {specialists.map((specialist) => (
                <SpecialistCard
                  key={specialist.id}
                  specialist={specialist}
                  serviceSlug={service.slug}
                />
              ))}
            </div>

            {reviews.length > 0 && (
              <div className="mt-16 border-t border-line pt-12">
                <Eyebrow className="mb-8">Отзывы об этой услуге</Eyebrow>
                <ReviewList reviews={reviews} columns={2} />
              </div>
            )}
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="section-y-tight hairline">
          <div className="shell">
            <Eyebrow className="mb-8">Часто берут вместе</Eyebrow>
            <div className="grid gap-8 sm:grid-cols-3">
              {related.map((item) => (
                <div key={item.id} className="border-t border-ink pt-4">
                  <TextLink to={routes.service(item.slug)}>{item.title}</TextLink>
                  <p className="type-small mt-2 text-muted">{item.outcome}</p>
                  <div className="mt-3">
                    <PriceTag price={item.price} size="sm" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}

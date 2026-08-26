import { useParams, useSearchParams } from 'react-router-dom';
import type { Specialist } from '@/types';
import { useSeo } from '@/hooks/useSeo';
import { breadcrumbSchema, personSchema } from '@/lib/seo';
import { bookingLink, routes, worksLink } from '@/lib/routes';
import { track } from '@/lib/analytics';
import { formatExperience, formatPrice } from '@/lib/format';
import {
  filterPortfolio,
  getReviewsForSpecialist,
  getServiceBySlug,
  getServicesForSpecialist,
  getSpecialistBySlug,
} from '@/data';
import { useDeclareCta } from '@/app/CtaContext';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ButtonLink, TextLink } from '@/components/Button';
import { Figure } from '@/components/Figure';
import { Eyebrow } from '@/components/Typo';
import { RatingLine } from '@/components/Meta';
import { PortfolioCard } from '@/features/portfolio/PortfolioCard';
import { ReviewList } from '@/features/reviews/Reviews';
import { NotFoundPage } from './NotFoundPage';

/**
 * Specialist profile.
 *
 * Also the landing page for "Марина + блонд" campaigns: when a `?service=`
 * parameter is present, that service is pinned to the top of the page and
 * carried into the booking link, so the acquisition context survives the click.
 */
export function SpecialistPage() {
  const { slug = '' } = useParams();
  const specialist = getSpecialistBySlug(slug);

  if (!specialist) return <NotFoundPage />;
  return <SpecialistProfile key={specialist.id} specialist={specialist} />;
}

function SpecialistProfile({ specialist }: { specialist: Specialist }) {
  const [params] = useSearchParams();
  const contextService = getServiceBySlug(params.get('service') ?? '');
  const performsContextService =
    contextService && specialist.serviceIds.includes(contextService.id) ? contextService : undefined;

  const services = getServicesForSpecialist(specialist.id);
  const works = filterPortfolio({ specialistId: specialist.id });
  const reviews = getReviewsForSpecialist(specialist.id, 4);

  useSeo({
    title: `${specialist.name} — ${specialist.role} | Lanna Kamilina, Москва`,
    description: `${specialist.name}, ${specialist.role.toLowerCase()}, ${formatExperience(specialist.experienceYears)}. ${specialist.focus.join(', ')}. Работы, отзывы и запись онлайн в салоне Lanna Kamilina в центре Москвы.`,
    path: routes.specialist(specialist.slug),
    type: 'profile',
    jsonLd: [
      personSchema(specialist),
      breadcrumbSchema([
        { name: 'Главная', path: routes.home },
        { name: 'Мастера', path: routes.specialists },
        { name: specialist.name, path: routes.specialist(specialist.slug) },
      ]),
    ],
  });

  useDeclareCta({
    label: `Записаться к ${specialist.name}`,
    detail: performsContextService?.title,
    specialist: specialist.slug,
    serviceSlug: performsContextService?.slug,
    from: 'specialist-sticky',
  });

  return (
    <article className="section-y-tight">
      <div className="shell">
        <Breadcrumbs
          items={[
            { name: 'Главная', path: routes.home },
            { name: 'Мастера', path: routes.specialists },
            { name: specialist.name },
          ]}
          className="mb-8"
        />

        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Figure image={specialist.portrait} ratio="portrait" priority className="grain" />
          </div>

          <div className="lg:col-span-7">
            <Eyebrow>{specialist.role}</Eyebrow>
            <h1 className="type-hero mt-4 uppercase tracking-[0.02em]">{specialist.name}</h1>

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
              {specialist.rating && (
                <RatingLine value={specialist.rating.value} count={specialist.rating.count} />
              )}
              <span className="type-small text-muted">
                {formatExperience(specialist.experienceYears)}
              </span>
            </div>

            <p className="type-lead mt-7 max-w-xl">{specialist.bio}</p>

            <div className="mt-8">
              <Eyebrow className="mb-3">Специализация</Eyebrow>
              <p className="type-body">{specialist.focus.join(' · ')}</p>
            </div>

            {performsContextService && (
              <div className="mt-8 border border-line bg-paper-2/60 p-5">
                <Eyebrow className="mb-2 text-accent">Вы смотрели</Eyebrow>
                <div className="flex flex-wrap items-baseline justify-between gap-4">
                  <TextLink to={routes.service(performsContextService.slug)}>
                    {performsContextService.title}
                  </TextLink>
                  <span className="numeric type-small text-muted">
                    {formatPrice(performsContextService.price)}
                  </span>
                </div>
              </div>
            )}

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink
                to={bookingLink({
                  specialist: specialist.slug,
                  service: performsContextService?.slug,
                  from: 'specialist-detail',
                })}
                size="lg"
                onClick={() =>
                  track('booking_started', {
                    from: 'specialist-detail',
                    specialist: specialist.slug,
                  })
                }
              >
                Записаться к {specialist.name}
              </ButtonLink>
              <ButtonLink
                to={worksLink({ specialist: specialist.slug })}
                variant="secondary"
                size="lg"
              >
                Посмотреть работы
              </ButtonLink>
            </div>

            <div className="mt-12">
              <Eyebrow className="mb-4">Услуги мастера</Eyebrow>
              <ul>
                {services.map((service) => (
                  <li
                    key={service.id}
                    className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-line py-3"
                  >
                    <TextLink to={routes.service(service.slug)}>{service.title}</TextLink>
                    <span className="numeric type-small shrink-0 text-muted">
                      {formatPrice(service.price)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {works.length > 0 && (
          <section className="mt-20 border-t border-line pt-14">
            <div className="flex items-end justify-between gap-6">
              <h2 className="type-title">Работы {specialist.name}</h2>
              <TextLink to={worksLink({ specialist: specialist.slug })}>Все работы</TextLink>
            </div>
            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {works.slice(0, 4).map((item) => (
                <PortfolioCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        )}

        {reviews.length > 0 && (
          <section className="mt-20 border-t border-line pt-14">
            <h2 className="type-title">Отзывы о мастере</h2>
            <ReviewList reviews={reviews} columns={2} className="mt-10" />
          </section>
        )}
      </div>
    </article>
  );
}

import { useParams } from 'react-router-dom';
import type { PortfolioItem } from '@/types';
import { useSeo } from '@/hooks/useSeo';
import { breadcrumbSchema } from '@/lib/seo';
import { bookingLink, routes, worksLink } from '@/lib/routes';
import { track } from '@/lib/analytics';
import { formatDuration, formatPrice } from '@/lib/format';
import {
  getPortfolioByTags,
  getPortfolioItemBySlug,
  getReviewForPortfolioItem,
  getServices,
  getSpecialist,
} from '@/data';
import { useDeclareCta } from '@/app/CtaContext';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ButtonLink, TextLink } from '@/components/Button';
import { Figure } from '@/components/Figure';
import { Eyebrow } from '@/components/Typo';
import { RatingLine, Tag } from '@/components/Meta';
import { BeforeAfter } from '@/features/portfolio/BeforeAfter';
import { PortfolioCard } from '@/features/portfolio/PortfolioCard';
import { ReviewQuote } from '@/features/reviews/Reviews';
import { NotFoundPage } from './NotFoundPage';

/**
 * A single result.
 *
 * The landing page for social and campaign traffic: someone saw a photo and
 * wants that exact thing. Everything needed to decide is here — the work, the
 * before/after, who did it, what it costs, how long it takes — and the primary
 * action is availability, not a contact form.
 */
export function WorkPage() {
  const { slug = '' } = useParams();
  const item = getPortfolioItemBySlug(slug);

  // The lookup happens before any hook runs, so an unknown slug renders the
  // 404 page without leaving a half-initialised detail view behind it.
  if (!item) return <NotFoundPage />;
  return <WorkDetail key={item.id} item={item} />;
}

function WorkDetail({ item }: { item: PortfolioItem }) {
  const specialist = getSpecialist(item.specialistId);
  const services = getServices(item.serviceIds);
  const primary = services[0];
  const review = getReviewForPortfolioItem(item);
  const related = getPortfolioByTags(item.tags, 4).filter((entry) => entry.id !== item.id);

  useSeo({
    title: `${item.title} — ${item.summary} | Lanna Kamilina, Москва`,
    description: `${item.title}: ${item.summary}. Мастер${specialist ? ` — ${specialist.name}` : ''}. Цена, длительность и свободное время для записи в салоне Lanna Kamilina в Москве.`,
    path: routes.work(item.slug),
    type: 'article',
    jsonLd: [
      breadcrumbSchema([
        { name: 'Главная', path: routes.home },
        { name: 'Работы', path: routes.works },
        { name: item.title, path: routes.work(item.slug) },
      ]),
    ],
  });

  useDeclareCta({
    label: `Создать похожий образ`,
    detail: primary ? `${primary.title} · ${formatPrice(primary.price)}` : undefined,
    serviceSlug: primary?.slug,
    specialist: specialist?.slug,
    from: 'work-sticky',
  });

  return (
    <article className="section-y-tight">
      <div className="shell">
        <Breadcrumbs
          items={[
            { name: 'Главная', path: routes.home },
            { name: 'Работы', path: routes.works },
            { name: item.title },
          ]}
          className="mb-8"
        />

        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            {item.beforeAfter ? (
              <>
                <BeforeAfter
                  pair={item.beforeAfter}
                  ratio="portrait"
                  label={item.title}
                  trackingId={item.slug}
                />
                <p className="type-meta mt-3 text-muted">
                  Потяните ползунок, чтобы сравнить результат.
                </p>
              </>
            ) : (
              <Figure image={item.image} ratio="portrait" priority />
            )}
          </div>

          <div className="lg:col-span-5">
            <Eyebrow>{item.summary}</Eyebrow>
            <h1 className="type-display mt-4">{item.title}</h1>

            {specialist && (
              <div className="mt-8 flex items-center gap-4 border-y border-line py-5">
                <Figure
                  image={specialist.portrait}
                  ratio="square"
                  className="h-14 w-14 shrink-0 rounded-full"
                />
                <div className="min-w-0">
                  <p className="type-small">
                    Мастер:{' '}
                    <TextLink to={routes.specialist(specialist.slug)}>{specialist.name}</TextLink>
                  </p>
                  <p className="type-meta mt-1 flex items-center gap-2 text-muted">
                    {specialist.role}
                    {specialist.rating && (
                      <RatingLine value={specialist.rating.value} count={specialist.rating.count} />
                    )}
                  </p>
                </div>
              </div>
            )}

            {primary && (
              <div className="mt-8">
                <Eyebrow className="mb-4">Что входит</Eyebrow>
                <ul className="flex flex-col gap-3">
                  {services.map((service) => (
                    <li
                      key={service.id}
                      className="flex items-baseline justify-between gap-4 border-b border-line pb-3"
                    >
                      <TextLink to={routes.service(service.slug)}>{service.title}</TextLink>
                      <span className="numeric type-small shrink-0 text-muted">
                        {formatPrice(service.price)}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="type-meta mt-4 text-muted">
                  Длительность: {formatDuration(primary.duration)}. Точную стоимость мастер
                  назовёт на консультации, до начала работы.
                </p>
              </div>
            )}

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink
                to={bookingLink({
                  service: primary?.slug,
                  specialist: specialist?.slug,
                  from: 'work-detail',
                })}
                size="lg"
                onClick={() => track('booking_started', { from: 'work-detail', item: item.slug })}
              >
                Создать похожий образ
              </ButtonLink>
              {specialist && (
                <ButtonLink
                  to={worksLink({ specialist: specialist.slug })}
                  variant="secondary"
                  size="lg"
                >
                  Другие работы мастера
                </ButtonLink>
              )}
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>

            {review && (
              <div className="mt-10 border-t border-line pt-8">
                <Eyebrow className="mb-5">Отзыв об этой работе</Eyebrow>
                <ReviewQuote review={review} />
              </div>
            )}
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-20 border-t border-line pt-14">
            <Eyebrow className="mb-8">Похожие работы</Eyebrow>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((entry) => (
                <PortfolioCard key={entry.id} item={entry} />
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}

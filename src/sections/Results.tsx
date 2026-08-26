import { Link } from 'react-router-dom';
import { routes, worksLink } from '@/lib/routes';
import { track } from '@/lib/analytics';
import { getBeforeAfterItems, getFeaturedPortfolio, getService, getSpecialist } from '@/data';
import { portfolioFilters } from '@/data';
import { SectionHeader } from '@/components/Typo';
import { TextLink } from '@/components/Button';
import { Rail } from '@/components/Rail';
import { Reveal } from '@/components/Reveal';
import { RatingLine } from '@/components/Meta';
import { PortfolioCard } from '@/features/portfolio/PortfolioCard';
import { BeforeAfter } from '@/features/portfolio/BeforeAfter';
import { bookingLink } from '@/lib/routes';

/**
 * Results.
 *
 * The section that does the persuading. Everything here is a route into the
 * funnel: each card names the work, credits a specialist and links to booking
 * the same thing, and the category chips are real deep links rather than
 * decorative labels.
 */
export function ResultsSection() {
  const items = getFeaturedPortfolio(8);

  return (
    <section className="section-y" aria-labelledby="results-heading">
      <div className="shell">
        <SectionHeader
          eyebrow="Работы"
          title="Результаты"
          lead="Каждая работа — с мастером, услугой и ценой. Понравилось — можно записаться на то же самое."
          action={<TextLink to={routes.works}>Все работы</TextLink>}
        />

        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
          {portfolioFilters.slice(0, 6).map((filter) => (
            <Link
              key={filter.tag}
              to={worksLink({ tag: filter.tag })}
              onClick={() => track('portfolio_viewed', { tag: filter.tag, surface: 'home' })}
              className="type-small text-muted transition-colors hover:text-ink"
            >
              {filter.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="shell mt-10">
        <Rail ariaLabel="Избранные работы">
          {items.map((item, index) => (
            <div key={item.id} className="w-[76vw] max-w-[22rem] sm:w-[20rem] lg:w-[22rem]">
              <PortfolioCard item={item} priority={index < 2} />
            </div>
          ))}
        </Rail>
      </div>
    </section>
  );
}

/**
 * Before / after.
 *
 * One large comparison carries more conviction than a grid of thumbnails, so
 * the featured transformation gets the space, and two more sit alongside for
 * breadth.
 */
export function BeforeAfterSection() {
  const items = getBeforeAfterItems(3);
  const [lead, ...rest] = items;
  if (!lead?.beforeAfter) return null;

  const specialist = getSpecialist(lead.specialistId);
  const service = getService(lead.serviceIds[0]);

  return (
    <section className="section-y bg-ink text-paper" aria-labelledby="before-after-heading">
      <div className="shell">
        <SectionHeader
          eyebrow="До и после"
          title="Разница, которую видно"
          lead="Потяните ползунок. Это те же волосы, тот же свет и один визит между кадрами."
          tone="paper"
        />

        <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-7">
            <BeforeAfter
              pair={lead.beforeAfter}
              ratio="landscape"
              label={lead.title}
              trackingId={lead.slug}
            />
            <div className="mt-5 flex flex-wrap items-baseline justify-between gap-4">
              <div>
                <h3 className="type-subtitle text-paper">{lead.title}</h3>
                <p className="type-small mt-1 text-paper/60">{lead.summary}</p>
              </div>
              {specialist && (
                <p className="type-small flex items-center gap-2 text-paper/70">
                  Мастер: {specialist.name}
                  {specialist.rating && (
                    <RatingLine value={specialist.rating.value} showStars={false} className="text-paper/60" />
                  )}
                </p>
              )}
            </div>
            <div className="mt-5">
              <Link
                to={bookingLink({
                  service: service?.slug,
                  specialist: specialist?.slug,
                  from: 'before-after',
                })}
                onClick={() => track('booking_started', { from: 'before-after' })}
                className="type-small inline-flex items-center gap-2 border-b border-paper/30 pb-1 font-medium text-paper transition-colors hover:border-paper"
              >
                Создать похожий образ
              </Link>
            </div>
          </Reveal>

          <div className="flex flex-col gap-10 lg:col-span-5">
            {rest.map((item, index) =>
              item.beforeAfter ? (
                <Reveal key={item.id} delay={index * 80}>
                  <BeforeAfter
                    pair={item.beforeAfter}
                    ratio="wide"
                    label={item.title}
                    trackingId={item.slug}
                  />
                  <h3 className="type-small mt-3 font-medium text-paper">{item.title}</h3>
                  <p className="type-meta mt-1 text-paper/55">{item.summary}</p>
                </Reveal>
              ) : null,
            )}

            <Link
              to={worksLink()}
              className="type-small mt-auto inline-flex w-fit items-center gap-2 border-b border-paper/30 pb-1 text-paper/80 transition-colors hover:border-paper hover:text-paper"
            >
              Все трансформации
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

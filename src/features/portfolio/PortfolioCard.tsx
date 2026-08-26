import { Link } from 'react-router-dom';
import type { PortfolioItem } from '@/types';
import { cn } from '@/lib/utils';
import { bookingLink, routes } from '@/lib/routes';
import { track } from '@/lib/analytics';
import { getService, getSpecialist } from '@/data';
import { Figure, Scrim } from '@/components/Figure';
import { RatingLine } from '@/components/Meta';
import { ArrowRight } from '@/components/Button';

/**
 * A portfolio card is a conversion object, not a photograph.
 *
 * It names the work, credits the specialist, and offers a direct route to
 * booking the same thing. Two sibling links rather than a nested one: the card
 * body opens the result, the footer action goes straight to the calendar.
 */
export function PortfolioCard({
  item,
  className,
  priority = false,
}: {
  item: PortfolioItem;
  className?: string;
  priority?: boolean;
}) {
  const specialist = getSpecialist(item.specialistId);
  const primaryService = getService(item.serviceIds[0]);

  return (
    <article className={cn('group flex flex-col', className)}>
      <Link
        to={routes.work(item.slug)}
        onClick={() => track('look_viewed', { item: item.slug, surface: 'card' })}
        className="block"
      >
        <Figure
          image={item.image}
          ratio={item.orientation === 'landscape' ? 'landscape' : item.orientation === 'square' ? 'square' : 'portrait'}
          hoverZoom
          priority={priority}
          className="bg-paper-2"
        >
          <Scrim className="opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          {item.beforeAfter && (
            <span className="type-meta absolute top-3 left-3 rounded-xs bg-paper/90 px-2 py-1 text-ink uppercase">
              До / После
            </span>
          )}
          <span className="absolute inset-x-0 bottom-0 flex translate-y-2 items-center gap-2 p-4 text-paper opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            <span className="type-small font-medium">Смотреть работу</span>
            <ArrowRight />
          </span>
        </Figure>

        <div className="mt-4">
          <h3 className="type-subtitle">{item.title}</h3>
          <p className="type-small mt-1 text-muted">{item.summary}</p>
        </div>
      </Link>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        {specialist && (
          <Link
            to={routes.specialist(specialist.slug)}
            className="type-small text-ink-2 transition-colors hover:text-ink"
          >
            Мастер: {specialist.name}
            {specialist.rating && (
              <RatingLine
                value={specialist.rating.value}
                className="ml-2 align-middle text-muted"
                showStars={false}
              />
            )}
          </Link>
        )}

        <Link
          to={bookingLink({
            service: primaryService?.slug,
            specialist: specialist?.slug,
            from: 'portfolio-card',
          })}
          onClick={() =>
            track('booking_started', { from: 'portfolio-card', item: item.slug })
          }
          className="type-small inline-flex items-center gap-1.5 border-b border-line-strong pb-0.5 font-medium transition-colors hover:border-ink"
        >
          Хочу так же
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </article>
  );
}

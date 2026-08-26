import { Link } from 'react-router-dom';
import type { Specialist } from '@/types';
import { cn } from '@/lib/utils';
import { bookingLink, routes } from '@/lib/routes';
import { track } from '@/lib/analytics';
import { formatExperience } from '@/lib/format';
import { Figure } from '@/components/Figure';
import { ArrowRight } from '@/components/Button';
import { RatingLine } from '@/components/Meta';

/**
 * Specialist card.
 *
 * In a salon the specialist is the product. The card carries the two things
 * that decide a first booking — what they are known for and what other people
 * scored them — and routes straight to their availability.
 */
export function SpecialistCard({
  specialist,
  className,
  serviceSlug,
  priority = false,
}: {
  specialist: Specialist;
  className?: string;
  /** Preserves acquisition context: «Марина + блонд» stays intact. */
  serviceSlug?: string;
  priority?: boolean;
}) {
  return (
    <article className={cn('group flex flex-col', className)}>
      <Link
        to={
          serviceSlug
            ? `${routes.specialist(specialist.slug)}?service=${serviceSlug}`
            : routes.specialist(specialist.slug)
        }
        onClick={() => track('specialist_viewed', { specialist: specialist.slug, surface: 'card' })}
        className="block"
      >
        <Figure image={specialist.portrait} ratio="portrait" hoverZoom priority={priority} />

        <div className="mt-4 flex items-baseline justify-between gap-3">
          <h3 className="type-subtitle uppercase tracking-[0.04em]">{specialist.name}</h3>
          {specialist.rating && (
            <RatingLine value={specialist.rating.value} count={specialist.rating.count} />
          )}
        </div>
        <p className="type-small mt-1 text-muted">
          {specialist.role} · {formatExperience(specialist.experienceYears)}
        </p>
      </Link>

      <p className="type-small mt-3 text-ink-2">{specialist.focus.join(' · ')}</p>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
        <Link
          to={`${routes.works}?master=${specialist.slug}`}
          className="type-small inline-flex items-center gap-1.5 border-b border-line-strong pb-0.5 transition-colors hover:border-ink"
        >
          Работы
        </Link>
        <Link
          to={bookingLink({
            specialist: specialist.slug,
            service: serviceSlug,
            from: 'specialist-card',
          })}
          onClick={() =>
            track('booking_started', { from: 'specialist-card', specialist: specialist.slug })
          }
          className="type-small inline-flex items-center gap-1.5 border-b border-line-strong pb-0.5 font-medium transition-colors hover:border-ink"
        >
          Записаться к {specialist.name}
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </article>
  );
}

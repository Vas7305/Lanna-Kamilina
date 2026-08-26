import { Link } from 'react-router-dom';
import type { Service } from '@/types';
import { cn } from '@/lib/utils';
import { bookingLink, routes } from '@/lib/routes';
import { track } from '@/lib/analytics';
import { Figure } from '@/components/Figure';
import { ArrowRight } from '@/components/Button';
import { DurationTag, MetaDot, PriceTag } from '@/components/Meta';

/**
 * Service row.
 *
 * Price and duration are on the row itself. Making someone open a page — or
 * worse, send a message — to find out what a haircut costs is the fastest way
 * to lose a comparison-minded customer.
 */
export function ServiceRow({ service, className }: { service: Service; className?: string }) {
  return (
    <div className={cn('group border-b border-line', className)}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-3 py-6">
        <div className="min-w-0 flex-1">
          <Link
            to={routes.service(service.slug)}
            onClick={() => track('service_viewed', { service: service.slug, surface: 'list' })}
            className="type-subtitle inline-flex items-center gap-2 transition-colors hover:text-accent-ink"
          >
            {service.title}
            <ArrowRight className="opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100" />
          </Link>
          <p className="type-small mt-1.5 max-w-xl text-muted">{service.outcome}</p>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <DurationTag duration={service.duration} />
          <MetaDot />
          <PriceTag price={service.price} />
        </div>
      </div>
    </div>
  );
}

/** Visual service card for rails and category grids. */
export function ServiceCard({
  service,
  className,
  priority = false,
}: {
  service: Service;
  className?: string;
  priority?: boolean;
}) {
  return (
    <article className={cn('group flex flex-col', className)}>
      <Link
        to={routes.service(service.slug)}
        onClick={() => track('service_viewed', { service: service.slug, surface: 'card' })}
        className="block"
      >
        <Figure image={service.image} ratio="landscape" hoverZoom priority={priority} />
        <h3 className="type-subtitle mt-4">{service.title}</h3>
        <p className="type-small mt-1.5 text-muted">{service.outcome}</p>
      </Link>

      <div className="mt-3 flex items-center gap-3">
        <PriceTag price={service.price} size="sm" />
        <MetaDot />
        <DurationTag duration={service.duration} />
      </div>

      <Link
        to={bookingLink({ service: service.slug, from: 'service-card' })}
        onClick={() => track('booking_started', { from: 'service-card', service: service.slug })}
        className="type-small mt-4 inline-flex w-fit items-center gap-1.5 border-b border-line-strong pb-0.5 font-medium transition-colors hover:border-ink"
      >
        Свободное время
        <ArrowRight className="h-3 w-3" />
      </Link>
    </article>
  );
}

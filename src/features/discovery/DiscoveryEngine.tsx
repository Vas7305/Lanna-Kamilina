import type { Recommendation } from '@/types';
import { cn } from '@/lib/utils';
import { bookingLink, routes } from '@/lib/routes';
import { track } from '@/lib/analytics';
import { formatRub } from '@/lib/format';
import { getPortfolioItems, getService, getSpecialists } from '@/data';
import { Button, ButtonLink, TextLink } from '@/components/Button';
import { Eyebrow } from '@/components/Typo';
import { DurationTag, MetaDot } from '@/components/Meta';
import { PortfolioCard } from '@/features/portfolio/PortfolioCard';
import { SpecialistCard } from '@/features/specialists/SpecialistCard';
import { useDiscovery } from './useDiscovery';

/**
 * «Подобрать образ» — the discovery engine.
 *
 * Two or three taps, then a real answer: what to book, what it costs, how long
 * it takes, who does it, what it looks like, and when there is free time. The
 * flow exists to convert uncertainty into a decision, so it never asks a
 * question whose answer would not change the recommendation.
 */
export function DiscoveryEngine({
  startTag,
  compact = false,
  className,
}: {
  startTag?: string;
  /** Homepage variant: tighter spacing, no page-level chrome. */
  compact?: boolean;
  className?: string;
}) {
  const discovery = useDiscovery(startTag);

  if (discovery.recommendation) {
    return (
      <RecommendationPanel
        recommendation={discovery.recommendation}
        onRestart={discovery.restart}
        compact={compact}
        className={className}
      />
    );
  }

  if (!discovery.question) return null;

  return (
    <div className={cn('animate-fade-up', className)} key={discovery.question.id}>
      <div className="flex items-center justify-between gap-4">
        <Eyebrow>
          Шаг {discovery.step} из {Math.max(discovery.totalSteps, discovery.step)}
        </Eyebrow>
        {discovery.answers.length > 0 && (
          <button
            type="button"
            onClick={discovery.back}
            className="type-small text-muted transition-colors hover:text-ink"
          >
            ← Назад
          </button>
        )}
      </div>

      <h2 className={cn('mt-4', compact ? 'type-title' : 'type-display')}>
        {discovery.question.title}
      </h2>
      {discovery.question.hint && (
        <p className="type-small mt-3 max-w-xl text-muted">{discovery.question.hint}</p>
      )}

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {discovery.question.options.map((option, index) => (
          <button
            key={option.id}
            type="button"
            onClick={() => discovery.select(option.id)}
            className={cn(
              'animate-fade-up group flex min-h-[4.5rem] flex-col justify-center gap-1 rounded-xs border border-line-strong px-5 py-4 text-left',
              'transition-[border-color,background-color,transform] duration-200',
              'hover:-translate-y-0.5 hover:border-ink hover:bg-paper-2',
            )}
            style={{ animationDelay: `${index * 35}ms` }}
          >
            <span className="type-body font-medium">{option.label}</span>
            {option.hint && <span className="type-meta text-muted">{option.hint}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------- recommendation */

export function RecommendationPanel({
  recommendation,
  onRestart,
  compact = false,
  className,
}: {
  recommendation: Recommendation;
  onRestart?: () => void;
  compact?: boolean;
  className?: string;
}) {
  const services = recommendation.serviceIds
    .map((id) => getService(id))
    .filter((service): service is NonNullable<typeof service> => Boolean(service));
  const primary = services[0];
  const specialists = getSpecialists(recommendation.specialistIds).slice(0, 3);
  const results = getPortfolioItems(recommendation.portfolioIds).slice(0, compact ? 2 : 4);

  return (
    <div className={cn('animate-fade-up', className)}>
      <Eyebrow tone="accent">Рекомендуем</Eyebrow>

      <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <h2 className={compact ? 'type-title' : 'type-display'}>{recommendation.title}</h2>
          <p className="type-lead mt-4">{recommendation.rationale}</p>
        </div>

        <div className="flex shrink-0 flex-col gap-1 lg:items-end lg:text-right">
          <span className="numeric type-title font-display">
            от {formatRub(recommendation.priceFrom)}
          </span>
          <DurationTag duration={recommendation.duration} />
        </div>
      </div>

      <ul className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2">
        {services.map((service, index) => (
          <li key={service.id} className="flex items-center gap-4">
            {index > 0 && <MetaDot />}
            <TextLink to={routes.service(service.slug)}>{service.title}</TextLink>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink
          to={bookingLink({
            service: primary?.slug,
            from: 'recommendation',
          })}
          size="lg"
          onClick={() =>
            track('booking_started', { from: 'recommendation', service: primary?.slug ?? null })
          }
        >
          Посмотреть доступное время
        </ButtonLink>
        {onRestart && (
          <Button variant="secondary" size="lg" onClick={onRestart}>
            Начать заново
          </Button>
        )}
      </div>

      {specialists.length > 0 && (
        <section className="mt-14">
          <Eyebrow className="mb-6">Кто это делает</Eyebrow>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {specialists.map((specialist) => (
              <SpecialistCard
                key={specialist.id}
                specialist={specialist}
                serviceSlug={primary?.slug}
              />
            ))}
          </div>
        </section>
      )}

      {results.length > 0 && (
        <section className="mt-14">
          <Eyebrow className="mb-6">Похожие работы</Eyebrow>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {results.map((item) => (
              <PortfolioCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

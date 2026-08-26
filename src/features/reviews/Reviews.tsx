import type { Review } from '@/types';
import { cn } from '@/lib/utils';
import { formatDayMonth, formatRating, formatYears } from '@/lib/format';
import { getAverageRating, reputation, yearsInBusiness } from '@/data';
import { RatingLine, Stars } from '@/components/Meta';

const PLATFORM_LABEL: Record<Review['platform'], string> = {
  yandex: 'Яндекс Карты',
  '2gis': '2ГИС',
  vk: 'VK',
  site: 'Сайт салона',
};

/**
 * A single review, shown where a doubt appears.
 *
 * Reviews are placed next to the service, specialist or result they describe
 * rather than collected into a testimonial wall — a quote about blonde work is
 * only persuasive on the page where blonde work is being considered.
 */
export function ReviewQuote({
  review,
  className,
  tone = 'default',
}: {
  review: Review;
  className?: string;
  tone?: 'default' | 'quiet';
}) {
  return (
    <figure
      className={cn(
        'flex flex-col gap-4',
        tone === 'default' && 'border-l border-line-strong pl-5',
        className,
      )}
    >
      <Stars value={review.rating} className="text-accent" />
      <blockquote className="type-body text-ink-2">«{review.text}»</blockquote>
      <figcaption className="type-meta flex flex-wrap items-center gap-x-2 text-muted">
        <span className="text-ink-2">{review.author}</span>
        <span aria-hidden="true">·</span>
        <span>{PLATFORM_LABEL[review.platform]}</span>
        <span aria-hidden="true">·</span>
        <time dateTime={review.date}>{formatDayMonth(review.date)}</time>
      </figcaption>
    </figure>
  );
}

export function ReviewList({
  reviews,
  className,
  columns = 2,
}: {
  reviews: Review[];
  className?: string;
  columns?: 1 | 2 | 3;
}) {
  if (reviews.length === 0) return null;
  return (
    <div
      className={cn(
        'grid gap-8',
        columns === 3 && 'md:grid-cols-2 lg:grid-cols-3',
        columns === 2 && 'md:grid-cols-2',
        className,
      )}
    >
      {reviews.map((review) => (
        <ReviewQuote key={review.id} review={review} />
      ))}
    </div>
  );
}

/**
 * Aggregate reputation.
 *
 * Shows the platforms a Moscow customer already trusts, plus the one fact that
 * no competitor can copy: how long the salon has been open.
 */
export function ReputationStrip({ className }: { className?: string }) {
  const average = getAverageRating();

  return (
    <div className={cn('grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-4', className)}>
      <div className="flex flex-col gap-2 bg-paper px-6 py-7">
        <span className="type-eyebrow text-muted">Средняя оценка</span>
        <span className="flex items-baseline gap-3">
          <span className="numeric type-title font-display">{formatRating(average)}</span>
          <Stars value={average} className="text-accent" size={14} />
        </span>
      </div>

      {reputation.map((item) => (
        <div key={item.platform} className="flex flex-col gap-2 bg-paper px-6 py-7">
          <span className="type-eyebrow text-muted">{item.label}</span>
          <RatingLine value={item.rating.value} count={item.rating.count} className="text-ink" />
        </div>
      ))}

      <div className="flex flex-col gap-2 bg-paper px-6 py-7">
        <span className="type-eyebrow text-muted">Опыт</span>
        <span className="type-body">
          {formatYears(yearsInBusiness)} работы в центре Москвы
        </span>
      </div>
    </div>
  );
}

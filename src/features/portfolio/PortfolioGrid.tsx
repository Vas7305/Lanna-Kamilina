import type { PortfolioItem } from '@/types';
import { cn } from '@/lib/utils';
import { Chip } from '@/components/Meta';
import { PortfolioCard } from './PortfolioCard';

/**
 * Masonry-style gallery.
 *
 * CSS columns rather than a rigid grid: portrait and landscape results keep
 * their natural proportions instead of being cropped into identical squares,
 * which is what makes a beauty portfolio read as editorial.
 */
export function PortfolioGrid({
  items,
  className,
  columns = 3,
}: {
  items: PortfolioItem[];
  className?: string;
  columns?: 2 | 3;
}) {
  return (
    <div
      className={cn(
        'gap-x-6 [column-fill:_balance]',
        columns === 3 ? 'columns-1 sm:columns-2 lg:columns-3' : 'columns-1 sm:columns-2',
        className,
      )}
    >
      {items.map((item, index) => (
        <div key={item.id} className="mb-10 break-inside-avoid">
          <PortfolioCard item={item} priority={index < 3} />
        </div>
      ))}
    </div>
  );
}

/** Filter rail. Horizontally scrollable on mobile so nothing wraps into a wall. */
export function PortfolioFilters({
  filters,
  active,
  onChange,
  className,
}: {
  filters: Array<{ tag: string; label: string }>;
  active: string | null;
  onChange: (tag: string | null) => void;
  className?: string;
}) {
  return (
    <div
      className={cn('rail -mx-5 gap-2 px-5 sm:-mx-8 sm:px-8 xl:mx-0 xl:px-0', className)}
      role="group"
      aria-label="Фильтр работ"
    >
      <Chip as="button" active={active === null} onClick={() => onChange(null)} aria-pressed={active === null}>
        Все
      </Chip>
      {filters.map((filter) => (
        <Chip
          key={filter.tag}
          as="button"
          active={active === filter.tag}
          aria-pressed={active === filter.tag}
          onClick={() => onChange(active === filter.tag ? null : filter.tag)}
        >
          {filter.label}
        </Chip>
      ))}
    </div>
  );
}

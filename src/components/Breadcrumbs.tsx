import { Link } from '@/components/AppLink';
import { cn } from '@/lib/utils';

export interface Crumb {
  name: string;
  path?: string;
}

/** Orientation for deep-linked arrivals — most visitors do not land on the homepage. */
export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Хлебные крошки" className={cn('type-meta text-muted', className)}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={`${item.name}-${index}`} className="flex items-center gap-2">
              {item.path && !last ? (
                <Link to={item.path} className="transition-colors hover:text-ink">
                  {item.name}
                </Link>
              ) : (
                <span className={cn(last && 'text-ink-2')} aria-current={last ? 'page' : undefined}>
                  {item.name}
                </span>
              )}
              {!last && (
                <span aria-hidden="true" className="text-line-strong">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function EmptyState({
  title,
  body,
  action,
  className,
}: {
  title: string;
  body?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-4 border border-dashed border-line-strong px-6 py-14 text-center',
        className,
      )}
    >
      <p className="type-subtitle">{title}</p>
      {body && <p className="type-body max-w-md text-muted">{body}</p>}
      {action}
    </div>
  );
}

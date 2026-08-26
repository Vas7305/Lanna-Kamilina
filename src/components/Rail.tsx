import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * Horizontal snap rail.
 *
 * Mobile gets a native swipe; desktop gets arrow controls that only appear
 * when there is somewhere to go. The rail is a real scroll container, so
 * keyboard users can page through it with the arrow keys and screen readers
 * see an ordinary list.
 */

export function Rail({
  children,
  className,
  edgeToEdge = true,
  ariaLabel,
}: {
  children: React.ReactNode;
  className?: string;
  /** Lets cards bleed to the viewport edge on mobile, which reads as editorial. */
  edgeToEdge?: boolean;
  ariaLabel?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState({ start: true, end: false });

  const measure = useCallback(() => {
    const node = ref.current;
    if (!node) return;
    const max = node.scrollWidth - node.clientWidth;
    setState({ start: node.scrollLeft <= 4, end: node.scrollLeft >= max - 4 });
  }, []);

  useEffect(() => {
    measure();
    const node = ref.current;
    if (!node) return;
    node.addEventListener('scroll', measure, { passive: true });
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => {
      node.removeEventListener('scroll', measure);
      observer.disconnect();
    };
  }, [measure]);

  const page = (direction: 1 | -1) => {
    const node = ref.current;
    if (!node) return;
    node.scrollBy({ left: direction * Math.round(node.clientWidth * 0.8), behavior: 'smooth' });
  };

  const hasOverflow = !(state.start && state.end);

  return (
    <div className={cn('relative', className)}>
      <div
        ref={ref}
        role="group"
        aria-label={ariaLabel}
        tabIndex={0}
        className={cn(
          'rail pb-2',
          edgeToEdge &&
            '-mx-5 px-5 sm:-mx-8 sm:px-8 xl:-mx-12 xl:px-12',
        )}
      >
        {children}
      </div>

      {hasOverflow && (
        <div className="mt-6 hidden items-center gap-2 md:flex">
          <RailButton
            direction="prev"
            disabled={state.start}
            onClick={() => page(-1)}
          />
          <RailButton direction="next" disabled={state.end} onClick={() => page(1)} />
        </div>
      )}
    </div>
  );
}

function RailButton({
  direction,
  disabled,
  onClick,
}: {
  direction: 'prev' | 'next';
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === 'prev' ? 'Предыдущие' : 'Следующие'}
      className={cn(
        'flex h-11 w-11 items-center justify-center rounded-xs border transition-colors duration-200',
        disabled
          ? 'cursor-default border-line text-line-strong'
          : 'border-line-strong text-ink hover:border-ink hover:bg-paper-2',
      )}
    >
      <svg
        viewBox="0 0 16 16"
        className={cn('h-4 w-4', direction === 'prev' && 'rotate-180')}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        aria-hidden="true"
      >
        <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

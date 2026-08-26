import { useCallback, useRef, useState } from 'react';
import type { BeforeAfter as BeforeAfterPair } from '@/types';
import { cn } from '@/lib/utils';
import { track } from '@/lib/analytics';
import { Figure } from '@/components/Figure';
import type { AspectRatio } from '@/components/Figure';

/**
 * Before / after comparison.
 *
 * The strongest proof mechanism on the site, so it has to work everywhere:
 * pointer drag on desktop, touch drag on mobile, and arrow keys with a real
 * `slider` role for keyboard and screen-reader users. Both images are always
 * in the DOM with their own alt text, so the evidence survives even if the
 * interaction does not.
 */
export function BeforeAfter({
  pair,
  ratio = 'portrait',
  className,
  label,
  trackingId,
}: {
  pair: BeforeAfterPair;
  ratio?: AspectRatio;
  className?: string;
  label?: string;
  trackingId?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const [dragging, setDragging] = useState(false);
  const interacted = useRef(false);

  const reportInteraction = useCallback(() => {
    if (interacted.current) return;
    interacted.current = true;
    track('before_after_interacted', { item: trackingId ?? null });
  }, [trackingId]);

  const updateFromClientX = useCallback(
    (clientX: number) => {
      const node = containerRef.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const next = ((clientX - rect.left) / rect.width) * 100;
      setPosition(Math.min(100, Math.max(0, next)));
    },
    [],
  );

  const onPointerDown = (event: React.PointerEvent) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
    reportInteraction();
    updateFromClientX(event.clientX);
  };

  const onPointerMove = (event: React.PointerEvent) => {
    if (!dragging) return;
    updateFromClientX(event.clientX);
  };

  const onPointerUp = (event: React.PointerEvent) => {
    event.currentTarget.releasePointerCapture?.(event.pointerId);
    setDragging(false);
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    const step = event.shiftKey ? 10 : 2;
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      reportInteraction();
      setPosition((value) => Math.max(0, value - step));
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      reportInteraction();
      setPosition((value) => Math.min(100, value + step));
    } else if (event.key === 'Home') {
      event.preventDefault();
      setPosition(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      setPosition(100);
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn('relative touch-pan-y select-none', className)}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <Figure image={pair.after} ratio={ratio} className="w-full" />

      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <Figure image={pair.before} ratio={ratio} className="h-full w-full" />
      </div>

      <span className="type-meta pointer-events-none absolute top-3 left-3 rounded-xs bg-ink/70 px-2 py-1 text-paper uppercase">
        До
      </span>
      <span className="type-meta pointer-events-none absolute top-3 right-3 rounded-xs bg-paper/85 px-2 py-1 text-ink uppercase">
        После
      </span>

      <div
        role="slider"
        tabIndex={0}
        aria-label={label ? `Сравнение до и после: ${label}` : 'Сравнение до и после'}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(position)}
        aria-valuetext={`Показано ${Math.round(position)}% фотографии «до»`}
        onKeyDown={onKeyDown}
        className={cn(
          'absolute inset-y-0 z-10 flex w-11 -translate-x-1/2 cursor-ew-resize items-center justify-center',
          'focus-visible:outline-none',
        )}
        style={{ left: `${position}%` }}
      >
        <span aria-hidden="true" className="absolute inset-y-0 w-px bg-paper/85 shadow-[0_0_0_1px_rgba(25,21,18,0.15)]" />
        <span
          aria-hidden="true"
          className={cn(
            'relative flex h-11 w-11 items-center justify-center rounded-full bg-paper text-ink shadow-[0_4px_16px_-4px_rgba(25,21,18,0.5)]',
            'transition-transform duration-200',
            dragging && 'scale-95',
          )}
        >
          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.4">
            <path d="M7.5 6L4 10l3.5 4M12.5 6l3.5 4-3.5 4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </div>
  );
}

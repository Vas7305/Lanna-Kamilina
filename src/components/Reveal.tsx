import { cn } from '@/lib/utils';
import { useReveal } from '@/hooks/useReveal';

/**
 * Entrance wrapper. Content is rendered regardless of observer support — the
 * animation is an enhancement, never a gate on visibility.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = 'div',
  immediate = false,
}: {
  children: React.ReactNode;
  className?: string;
  /** Milliseconds. Kept small — staggering should feel like rhythm, not a queue. */
  delay?: number;
  as?: 'div' | 'section' | 'li' | 'article';
  immediate?: boolean;
}) {
  const { ref, shown } = useReveal<HTMLDivElement>({ immediate });

  return (
    <Tag
      ref={ref as React.Ref<never>}
      className={cn('reveal', shown && 'reveal-in', className)}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}

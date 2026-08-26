import { useEffect, useRef, useState } from 'react';

/**
 * One-shot entrance observer.
 *
 * Content is visible by default and the class is *added* on intersection, so a
 * failed observer or a reduced-motion preference can never leave the page
 * blank. Everything above the fold resolves on the first frame.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(options?: {
  threshold?: number;
  rootMargin?: string;
  /** Skip the animation entirely — used for above-the-fold content. */
  immediate?: boolean;
}) {
  const ref = useRef<T | null>(null);
  const [shown, setShown] = useState(Boolean(options?.immediate));

  useEffect(() => {
    if (shown) return;
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === 'undefined') {
      setShown(true);
      return;
    }

    const prefersReduced =
      typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShown(true);
          observer.disconnect();
        }
      },
      // Fire slightly before the block reaches the fold so the reveal has
      // finished by the time it is properly in view. The page scrolls under
      // inertia, so a block keeps travelling after the wheel stops — starting
      // late leaves it animating in the middle of the screen.
      {
        threshold: options?.threshold ?? 0.05,
        rootMargin: options?.rootMargin ?? '0px 0px -12% 0px',
      },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [shown, options?.threshold, options?.rootMargin]);

  return { ref, shown } as const;
}

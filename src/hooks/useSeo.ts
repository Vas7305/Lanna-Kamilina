import { useEffect } from 'react';
import type { SeoInput } from '@/types';
import { applySeo } from '@/lib/seo';

/**
 * Declares the head for a page. JSON-LD nodes are removed on unmount so two
 * pages can never contribute contradictory structured data at once.
 *
 * `jsonLd` is intentionally excluded from the dependency list by way of a
 * serialised key — callers build the array inline and would otherwise thrash.
 */
export function useSeo(input: SeoInput): void {
  const key = JSON.stringify(input);

  useEffect(() => {
    const cleanup = applySeo(JSON.parse(key) as SeoInput);
    return cleanup;
  }, [key]);
}

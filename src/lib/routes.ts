/**
 * Route table.
 *
 * Paths are transliterated Russian — what a Moscow visitor expects to see in
 * the address bar, and what Yandex indexes best. Every link in the app is
 * built through these helpers so a URL change is a one-file change.
 */

import type { ServiceCategoryId, SpecialistSelection } from '@/types';

export const routes = {
  home: '/',
  works: '/raboty',
  work: (slug: string) => `/raboty/${slug}`,
  services: '/uslugi',
  serviceCategory: (slug: string) => `/uslugi?category=${slug}`,
  service: (slug: string) => `/uslugi/${slug}`,
  specialists: '/mastera',
  specialist: (slug: string) => `/mastera/${slug}`,
  discovery: '/podbor',
  about: '/o-nas',
  contacts: '/kontakty',
  booking: '/zapis',
  bookingDone: '/zapis/gotovo',
  privacy: '/politika-konfidencialnosti',
} as const;

export interface BookingLinkParams {
  service?: string;
  specialist?: SpecialistSelection;
  date?: string;
  time?: string;
  /** Free-form origin marker, e.g. `hero`, `portfolio-card`, `recommendation`. */
  from?: string;
}

/**
 * Deep link into the booking flow with as much context pre-filled as the
 * caller knows. A campaign that already knows "Марина + блонд" must never
 * drop the visitor on a blank form.
 */
export function bookingLink(params: BookingLinkParams = {}): string {
  const search = new URLSearchParams();
  if (params.service) search.set('service', params.service);
  if (params.specialist) search.set('specialist', params.specialist);
  if (params.date) search.set('date', params.date);
  if (params.time) search.set('time', params.time);
  if (params.from) search.set('from', params.from);
  const query = search.toString();
  return query ? `${routes.booking}?${query}` : routes.booking;
}

export interface WorksLinkParams {
  tag?: string;
  specialist?: string;
  service?: string;
}

export function worksLink(params: WorksLinkParams = {}): string {
  const search = new URLSearchParams();
  if (params.tag) search.set('tag', params.tag);
  if (params.specialist) search.set('master', params.specialist);
  if (params.service) search.set('service', params.service);
  const query = search.toString();
  return query ? `${routes.works}?${query}` : routes.works;
}

export function specialistWithService(specialistSlug: string, serviceSlug: string): string {
  return `${routes.specialist(specialistSlug)}?service=${serviceSlug}`;
}

export function discoveryLink(startTag?: string): string {
  return startTag ? `${routes.discovery}?start=${startTag}` : routes.discovery;
}

/** Primary navigation, in the order a first-time visitor needs it. */
export const primaryNav: Array<{ label: string; to: string; category?: ServiceCategoryId }> = [
  { label: 'Работы', to: routes.works },
  { label: 'Услуги', to: routes.services },
  { label: 'Мастера', to: routes.specialists },
  { label: 'О нас', to: routes.about },
  { label: 'Контакты', to: routes.contacts },
];

/** Canonical origin. Replace when the production domain is confirmed. */
export const SITE_ORIGIN = 'https://lannakamilina.ru';

export function absoluteUrl(path: string): string {
  return `${SITE_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`;
}

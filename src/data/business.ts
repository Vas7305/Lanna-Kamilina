import type { BusinessInformation } from '@/types';

/**
 * CONTENT MODE
 *
 * `demo` means the catalogue, prices, portfolio and reviews in `src/data` are
 * illustrative placeholders shaped like the real thing — they exist so the
 * interface can be designed and tested, not so they can be published as fact.
 * Flip to `live` once real content is loaded; the UI drops its demo notices
 * and structured data starts emitting prices and ratings.
 */
export const CONTENT_MODE: 'demo' | 'live' = 'demo';
export const IS_DEMO_CONTENT = CONTENT_MODE === 'demo';

/**
 * Verified business facts only.
 *
 * `null` means "not supplied yet" and is rendered as a visible placeholder
 * token rather than an invented value. A phone number or an address that is
 * wrong is worse than one that is obviously missing.
 */
export const business: BusinessInformation = {
  name: 'Lanna Kamilina',
  legalCity: 'Москва',
  foundedYear: 1999,

  address: null,
  metro: null,
  phone: null,
  email: null,
  telegram: null,
  whatsapp: null,

  yandexMapsUrl: null,
  twoGisUrl: null,
  vkUrl: null,
  instagramUrl: null,

  openingHours: [
    { days: ['Mo', 'Tu', 'We', 'Th', 'Fr'], label: 'Пн – Пт', opens: null, closes: null },
    { days: ['Sa', 'Su'], label: 'Сб – Вс', opens: null, closes: null },
  ],

  coordinates: null,
};

/** Placeholder tokens, kept in one place so a content editor can grep for them. */
export const placeholders = {
  phone: '[ТЕЛЕФОН]',
  address: '[АДРЕС]',
  metro: '[МЕТРО]',
  email: '[EMAIL]',
  hours: '[ЧАСЫ РАБОТЫ]',
  telegram: '[TELEGRAM]',
  whatsapp: '[WHATSAPP]',
  maps: '[ССЫЛКА НА КАРТЫ]',
} as const;

export const yearsInBusiness = new Date().getFullYear() - business.foundedYear;

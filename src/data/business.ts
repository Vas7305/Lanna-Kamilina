import type { BusinessInformation } from '@/types';
import { twoGisHref, yandexMapsHref } from '@/lib/format';

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

  address: '1-я Тверская-Ямская улица, 19',
  metro: null,
  phone: '+7 (499) 250-07-00',
  email: null,
  telegram: '@LannaKamilinabeautyservice',
  whatsapp: '+7 915 000-78-11',

  yandexMapsUrl: null,
  twoGisUrl: null,
  vkUrl: null,
  instagramUrl: null,

  openingHours: [
    {
      days: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
      label: 'Ежедневно',
      opens: '10:00',
      closes: '21:00',
    },
  ],

  coordinates: null,
};

/**
 * Where a click on the address goes.
 *
 * The salon has not supplied its Yandex Maps or 2GIS organisation pages yet,
 * so both links are derived from the verified street address as a map search.
 * That is not an invented fact — it is the address the page already shows,
 * handed to the two services Moscow actually navigates with. As soon as
 * `yandexMapsUrl` / `twoGisUrl` are filled in, those win.
 */
export const mapUrls = {
  yandex:
    business.yandexMapsUrl ??
    (business.address ? yandexMapsHref(business.address, business.legalCity) : null),
  twoGis:
    business.twoGisUrl ??
    (business.address ? twoGisHref(business.address, business.legalCity) : null),
} as const;

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

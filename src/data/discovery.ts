import type { DiscoveryQuestion } from '@/types';

/**
 * Discovery flow — "Подобрать образ".
 *
 * Hard constraint: no path is longer than three questions. This is a
 * disambiguator, not a personality quiz. Every branch ends in a concrete
 * recommendation with a price, a duration and a way to see free time.
 */

export const DISCOVERY_ROOT = 'start';

export const discoveryQuestions: DiscoveryQuestion[] = [
  {
    id: 'start',
    title: 'Что вы хотите изменить или создать?',
    hint: 'Два-три вопроса — и мы покажем, что подойдёт, сколько это стоит и когда есть время.',
    options: [
      {
        id: 'hair',
        label: 'Волосы',
        hint: 'Форма, длина, состояние',
        next: 'hair',
        tags: ['volosy'],
      },
      {
        id: 'colour',
        label: 'Цвет',
        hint: 'Окрашивание, блонд, тон',
        next: 'colour',
        tags: ['okrashivanie'],
      },
      { id: 'makeup', label: 'Макияж', next: 'makeup', tags: ['makiyazh'] },
      {
        id: 'new-look',
        label: 'Новый образ',
        hint: 'Хочу заметное изменение',
        next: 'change',
        tags: ['obraz'],
      },
      {
        id: 'event',
        label: 'Образ для мероприятия',
        next: 'occasion',
        tags: ['sobytie', 'obraz'],
      },
      {
        id: 'full',
        label: 'Полный beauty-образ',
        hint: 'Волосы, макияж, брови, ногти в один день',
        next: null,
        tags: ['obraz', 'full'],
      },
      {
        id: 'unsure',
        label: 'Пока не знаю',
        next: 'unsure',
        tags: [],
      },
    ],
  },

  {
    id: 'hair',
    title: 'Что именно с волосами?',
    options: [
      {
        id: 'shape',
        label: 'Форма и длина',
        hint: 'Отросло, не держит форму',
        next: null,
        tags: ['strizhka'],
      },
      {
        id: 'styling',
        label: 'Укладка на конкретный день',
        next: null,
        tags: ['ukladka', 'sobytie'],
      },
      {
        id: 'condition',
        label: 'Состояние волос',
        hint: 'Сухость, ломкость, после осветления',
        next: null,
        tags: ['ukhod'],
      },
      {
        id: 'everything',
        label: 'Всё вместе',
        next: null,
        tags: ['strizhka', 'ukhod', 'okrashivanie'],
      },
    ],
  },

  {
    id: 'colour',
    title: 'Что вы хотите сделать с цветом?',
    options: [
      {
        id: 'blonde',
        label: 'Стать светлее',
        hint: 'Блонд, осветление',
        next: null,
        tags: ['blond'],
      },
      {
        id: 'refresh',
        label: 'Освежить текущий цвет',
        next: null,
        tags: ['tonirovanie'],
      },
      {
        id: 'low-maintenance',
        label: 'Реже подкрашивать корни',
        hint: 'Мягкий переход, растяжка цвета',
        next: null,
        tags: ['slozhnoe'],
      },
      {
        id: 'even',
        label: 'Ровный цвет или седина',
        next: null,
        tags: ['odin-ton'],
      },
    ],
  },

  {
    id: 'makeup',
    title: 'Для чего макияж?',
    options: [
      { id: 'day', label: 'На каждый день', next: null, tags: ['makiyazh-den'] },
      { id: 'evening', label: 'На вечер', next: null, tags: ['makiyazh-vecher', 'sobytie'] },
      { id: 'photo', label: 'Для съёмки', next: null, tags: ['fotosessiya', 'sobytie'] },
      { id: 'wedding', label: 'Свадьба', next: null, tags: ['svadba', 'sobytie'] },
    ],
  },

  {
    id: 'occasion',
    title: 'Для какого случая?',
    options: [
      { id: 'dinner', label: 'Ужин', next: null, tags: ['makiyazh-vecher'] },
      { id: 'party', label: 'Вечеринка', next: null, tags: ['makiyazh-vecher'] },
      {
        id: 'wedding-bride',
        label: 'Свадьба — я невеста',
        hint: 'Предложим репетицию образа заранее',
        next: null,
        tags: ['svadba', 'svadba-nevesta'],
      },
      { id: 'wedding-guest', label: 'Свадьба — я гостья', next: null, tags: ['makiyazh-vecher'] },
      { id: 'photo', label: 'Фотосессия', next: null, tags: ['fotosessiya'] },
      { id: 'other', label: 'Другое', next: null, tags: ['makiyazh-vecher'] },
    ],
  },

  {
    id: 'change',
    title: 'Насколько заметное изменение вы хотите?',
    options: [
      { id: 'subtle', label: 'Аккуратно обновить', next: null, tags: ['strizhka', 'tonirovanie'] },
      { id: 'shape', label: 'Сменить форму', next: null, tags: ['strizhka'] },
      { id: 'colour', label: 'Сменить цвет', next: null, tags: ['okrashivanie', 'slozhnoe'] },
      { id: 'all', label: 'Всё сразу', next: null, tags: ['obraz', 'full'] },
    ],
  },

  {
    id: 'unsure',
    title: 'С чего начать?',
    hint: 'Достаточно выбрать то, что ближе всего.',
    options: [
      {
        id: 'fresher',
        label: 'Хочу выглядеть свежее',
        next: null,
        tags: ['ukhod', 'lico'],
      },
      {
        id: 'no-shape',
        label: 'Волосы давно без формы',
        next: null,
        tags: ['strizhka'],
      },
      {
        id: 'bored-colour',
        label: 'Надоел цвет',
        next: null,
        tags: ['okrashivanie', 'slozhnoe'],
      },
      {
        id: 'event-soon',
        label: 'Скоро событие',
        next: 'occasion',
        tags: ['sobytie'],
      },
    ],
  },
];

/**
 * Recommendation rules, most specific first.
 *
 * `requires` must all be present in the accumulated tag set. The first match
 * wins; `fallback` catches anything unmatched so the flow can never dead-end.
 */
export interface RecommendationRule {
  id: string;
  requires: string[];
  title: string;
  rationale: string;
  serviceIds: string[];
  /** Extra portfolio tags used to pull matching results. */
  portfolioTags: string[];
}

export const recommendationRules: RecommendationRule[] = [
  {
    id: 'wedding-bride',
    requires: ['svadba-nevesta'],
    title: 'Свадебный образ',
    rationale:
      'Для невесты мы всегда предлагаем репетицию заранее: в день свадьбы не должно быть решений, которые вы видите впервые.',
    serviceIds: ['svc-wedding-look', 'svc-makeup-wedding'],
    portfolioTags: ['svadba'],
  },
  {
    id: 'wedding',
    requires: ['svadba'],
    title: 'Свадебный образ',
    rationale: 'Макияж и причёска, собранные под один длинный день и под съёмку.',
    serviceIds: ['svc-wedding-look', 'svc-makeup-wedding'],
    portfolioTags: ['svadba'],
  },
  {
    id: 'full-look',
    requires: ['full'],
    title: 'Полный beauty-образ',
    rationale:
      'Волосы, макияж и брови в один визит, спланированные в правильном порядке — без ожидания между мастерами.',
    serviceIds: ['svc-full-look'],
    portfolioTags: ['obraz'],
  },
  {
    id: 'photo',
    requires: ['fotosessiya'],
    title: 'Образ для фотосессии',
    rationale:
      'Макияж рассчитывается под свет и камеру: контроль блеска и светотень важнее, чем то, как это выглядит в зеркале.',
    serviceIds: ['svc-photo-look', 'svc-makeup-photo'],
    portfolioTags: ['fotosessiya'],
  },
  {
    id: 'evening',
    requires: ['makiyazh-vecher'],
    title: 'Вечерний образ',
    rationale:
      'Макияж и укладка в одном визите, согласованные между собой и рассчитанные на искусственный свет.',
    serviceIds: ['svc-evening-look', 'svc-makeup-evening'],
    portfolioTags: ['sobytie', 'makiyazh'],
  },
  {
    id: 'blonde',
    requires: ['blond'],
    title: 'Блонд',
    rationale:
      'Осветление с тонированием и уходом. На консультации мастер скажет, за сколько визитов реально прийти к нужному оттенку.',
    serviceIds: ['svc-blonde'],
    portfolioTags: ['blond'],
  },
  {
    id: 'complex-colour',
    requires: ['slozhnoe'],
    title: 'Сложное окрашивание',
    rationale:
      'Мягкая растяжка цвета: отросшие корни не бросаются в глаза, коррекция нужна заметно реже.',
    serviceIds: ['svc-colour-complex'],
    portfolioTags: ['okrashivanie'],
  },
  {
    id: 'single-colour',
    requires: ['odin-ton'],
    title: 'Окрашивание в один тон',
    rationale: 'Ровный цвет по всей длине — базовое решение, когда нужен предсказуемый результат.',
    serviceIds: ['svc-colour-single'],
    portfolioTags: ['okrashivanie'],
  },
  {
    id: 'toning',
    requires: ['tonirovanie'],
    title: 'Тонирование',
    rationale: 'Короткий визит, который возвращает оттенок и продлевает жизнь окрашиванию.',
    serviceIds: ['svc-toning'],
    portfolioTags: ['okrashivanie'],
  },
  {
    id: 'hair-condition',
    requires: ['ukhod', 'volosy'],
    title: 'Уход и восстановление',
    rationale:
      'Сначала состояние волос, потом цвет: на восстановленной длине окрашивание ложится ровнее и держится дольше.',
    serviceIds: ['svc-hair-care', 'svc-womens-cut'],
    portfolioTags: ['ukhod'],
  },
  {
    id: 'face-care',
    requires: ['lico'],
    title: 'Уход за лицом и брови',
    rationale:
      'Самое заметное изменение при минимальном вмешательстве — ровный тон кожи и форма бровей под лицо.',
    serviceIds: ['svc-facial', 'svc-brows'],
    portfolioTags: ['ukhod', 'brovi'],
  },
  {
    id: 'styling',
    requires: ['ukladka'],
    title: 'Укладка',
    rationale: 'Час до события — и готовый вид, который держится нужное количество часов.',
    serviceIds: ['svc-styling'],
    portfolioTags: ['ukladka'],
  },
  {
    id: 'cut',
    requires: ['strizhka'],
    title: 'Стрижка и укладка',
    rationale:
      'Начинаем с формы: она определяет, сколько времени вы будете тратить на волосы каждое утро.',
    serviceIds: ['svc-womens-cut', 'svc-styling'],
    portfolioTags: ['strizhka'],
  },
  {
    id: 'makeup-day',
    requires: ['makiyazh-den'],
    title: 'Дневной макияж',
    rationale: 'Ровный тон и естественный акцент — выглядит одинаково хорошо при дневном свете и в кадре.',
    serviceIds: ['svc-makeup-day'],
    portfolioTags: ['makiyazh'],
  },
];

/** Used when nothing matched — a consultation is a legitimate answer. */
export const fallbackRecommendation: RecommendationRule = {
  id: 'fallback',
  requires: [],
  title: 'Стрижка и укладка с консультацией',
  rationale:
    'Если пока нет ясности, начинать логичнее с формы: на консультации мастер посмотрит волосы и предложит план на один или несколько визитов.',
  serviceIds: ['svc-womens-cut', 'svc-styling'],
  portfolioTags: ['strizhka', 'volosy'],
};

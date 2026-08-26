/**
 * Narrative content: heritage and experience.
 *
 * The dated milestones below are DEMO placeholders shaped for real history —
 * only the founding year (1999) and the city are verified facts. Replace the
 * copy, keep the structure.
 */

export interface Milestone {
  /** A year, or a phrase like «Сегодня» for the open end of the timeline. */
  marker: string;
  title: string;
  body: string;
  /** Verified facts survive the switch to live content unchanged. */
  verified?: boolean;
}

export const milestones: Milestone[] = [
  {
    marker: '1999',
    title: 'Начало',
    body: 'Салон открывается в центре Москвы. С первого дня работа строится вокруг одной идеи: клиент возвращается не за процедурой, а за результатом, который держится.',
    verified: true,
  },
  {
    marker: '2000-е',
    title: 'Работа с цветом',
    body: 'Колористика становится отдельным направлением. Появляется практика честной консультации: если результат нельзя получить за один визит, об этом говорят сразу.',
  },
  {
    marker: '2010-е',
    title: 'Образы целиком',
    body: 'К волосам добавляются макияж, брови и ногти. Свадьбы и съёмки собираются в один согласованный день, а не в цепочку отдельных записей.',
  },
  {
    marker: 'Сегодня',
    title: 'Команда и стандарт',
    body: 'Мастера меняются, стандарт — нет. Диагностика до работы, объяснение вместо обещаний, домашние рекомендации после.',
  },
];

export interface ExperiencePillar {
  title: string;
  body: string;
}

export const experiencePillars: ExperiencePillar[] = [
  {
    title: 'Разговор до, а не после',
    body: 'Каждый визит начинается с осмотра и вопросов: как вы живёте с волосами дома, сколько времени готовы тратить утром, когда следующее важное событие. От ответов зависит решение.',
  },
  {
    title: 'Честный прогноз',
    body: 'Если желаемый результат требует двух или трёх визитов, вы узнаете об этом до начала работы, а не в середине. Сроки и суммы называем заранее.',
  },
  {
    title: 'Один день вместо трёх',
    body: 'Волосы, макияж, брови и ногти можно собрать в один визит. Мы планируем последовательность так, чтобы вы не ждали между мастерами.',
  },
  {
    title: 'Результат, который повторяется',
    body: 'Мастер показывает, как укладывать дома, и записывает формулу цвета. В следующий визит вы получаете тот же оттенок, а не похожий.',
  },
];

/** Short proof points for the homepage — each one is checkable elsewhere on the site. */
export interface ProofPoint {
  value: string;
  label: string;
}

export const proofPoints: ProofPoint[] = [
  { value: 'с 1999', label: 'в центре Москвы' },
  { value: '6', label: 'мастеров в команде' },
  { value: '20+', label: 'услуг с открытыми ценами' },
  { value: 'онлайн', label: 'запись без звонка' },
];

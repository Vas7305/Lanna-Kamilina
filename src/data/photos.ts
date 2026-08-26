import type { ImageRef } from '@/types';

/**
 * Real photography.
 *
 * The shoot lives in `public/Lanna Kamilina/Clientes/` under numeric filenames,
 * which say nothing about what is in the frame. This module is the one place
 * that translates a file into a described image: every consumer imports a named
 * `ImageRef` and never a path, so re-shooting a look means editing one line
 * here instead of hunting through sections and catalogue data.
 *
 * Intrinsic dimensions are recorded so the browser can reserve the box before
 * the bytes arrive — `Figure` still fixes the aspect ratio, but width/height
 * keep the image itself from being the thing that shifts.
 */

const DIR = '/Lanna%20Kamilina/Clientes';

function photo(file: string, alt: string, width: number, height: number): ImageRef {
  return { src: `${DIR}/${file}`, alt, width, height };
}

/** Front-facing, warm, a full look — the strongest single frame we have. */
export const heroPortrait = photo(
  '1.png',
  'Клиентка салона Lanna Kamilina: мягкие волны и дневной макияж',
  434,
  542,
);

/** Cropped square in the hero. Close work, shown close. */
export const heroDetail = photo(
  '6.png',
  'Крупный план: растушёвка теней во время макияжа',
  434,
  541,
);

export const bridalWaves = photo(
  '2.png',
  'Свадебный образ: голливудская волна и кружевное платье',
  407,
  542,
);

export const dayMakeup = photo(
  '3.png',
  'Нанесение дневного макияжа: ровный тон и естественный акцент',
  352,
  542,
);

export const balayageLength = photo(
  '4.png',
  'Тёплый балаяж на длинных волосах: мягкая растяжка цвета по длине',
  345,
  544,
);

export const mensCut = photo(
  '5.png',
  'Мужская классическая стрижка с укладкой',
  371,
  355,
);

export const eveningLook = photo(
  '7.png',
  'Вечерний образ: локоны, красная помада и чёрное платье',
  361,
  543,
);

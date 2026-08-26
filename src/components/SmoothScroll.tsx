import { useEffect } from 'react';

/**
 * Inertial page scrolling — the whole document moves as one heavy body.
 *
 * The wheel no longer moves the page directly. It moves a *target*, and the
 * real scroll position eases toward that target every frame. Turning the wheel
 * is asking the page to go somewhere, not dragging it there: it takes up the
 * request gradually, keeps travelling after the wheel stops, and settles.
 *
 * WHY THIS IS AT THE PAGE LEVEL
 * Weight has to belong to the whole page or it reads as parts coming loose.
 * Giving only the photographs inertia makes them slide against type that is
 * still pinned to the raw scroll position, which looks like a rendering fault
 * rather than like mass. Here nothing moves relative to anything else — the
 * page is one object with momentum, and every element inherits it for free.
 *
 * WHY IT DRIVES NATIVE SCROLL
 * The usual way to build this — pin a wrapper and transform it — takes the
 * document out of the scroll model, which breaks `position: sticky`, scroll
 * anchoring, find-in-page and the scrollbar. This instead animates the real
 * scroll position via `scrollTo`, so every one of those keeps working
 * natively; only the *pacing* of the scroll is ours. The header's scrolled
 * state and the sticky booking bar both read `window.scrollY`, so they follow
 * the eased position for free.
 *
 * WHAT IS DELIBERATELY LEFT ALONE
 * Touch keeps its native momentum — the platform's is already this, tuned per
 * device, and layering ours on top only muddies it. Keyboard scrolling is
 * never intercepted: `preventDefault` on a key that scrolls is an
 * accessibility problem, so those jump instantly. Both paths land back in sync
 * through `onNativeScroll`.
 *
 * WHAT IT COSTS
 * Driving the scroll from JS takes it off the compositor thread. Native
 * scrolling keeps moving even while the main thread is busy; this cannot. Any
 * frame that overruns its budget is a frame the page visibly skips, which is
 * why what sits on screen during a scroll should stay cheap to paint — a
 * backdrop filter on fixed chrome is a per-frame cost now, not a one-off one.
 */

/**
 * Time constant, ms — the single number that sets how heavy the page feels.
 * It closes ~63% of the remaining distance in this long and effectively all of
 * it in four times as long, so one wheel notch keeps running for a bit over a
 * second. Raise it for more mass, lower it if it starts to feel unresponsive.
 */
const TAU = 260;
/**
 * Floor on how slowly the page may travel, px/s — about 2px a frame at 60Hz.
 *
 * This is what stops the scroll looking like stop motion, and it is not a
 * detail. An exponential approaches its target asymptotically, so its speed
 * falls below one pixel per frame while there is still ~16px to cover, and
 * then takes over a second to close that. The page spends that second inching
 * forward a pixel at a time — motion the eye reads as a low frame rate,
 * because in effect it is one. Holding a floor turns the last stretch into
 * steady, unmistakable movement and lets it actually arrive.
 */
const MIN_VELOCITY = 120;
/** A wheel event in line units carries no pixel size of its own. */
const LINE_HEIGHT = 16;

let target = 0;
let current = 0;
let limit = 0;
let rafId = 0;
let lastTime = 0;
/** True while the loop owns the scroll position, so its own events are ignored. */
let driving = false;

function measureLimit() {
  limit = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
}

function tick(now: number) {
  rafId = 0;

  // Frame-rate independence, and a cap so a background tab waking up does not
  // apply half a second of easing in a single step.
  const elapsed = lastTime ? Math.min(now - lastTime, 64) : 1000 / 60;
  lastTime = now;

  const distance = target - current;
  const eased = Math.abs(distance) * (1 - Math.exp(-elapsed / TAU));
  const floor = (MIN_VELOCITY * elapsed) / 1000;
  // Never past the target, never slower than the floor, and exact on arrival.
  current += Math.sign(distance) * Math.min(Math.abs(distance), Math.max(eased, floor));

  const arrived = current === target;

  window.scrollTo({ top: current, behavior: 'instant' as ScrollBehavior });

  if (arrived) {
    driving = false;
    lastTime = 0;
  } else {
    rafId = requestAnimationFrame(tick);
  }
}

/**
 * True when the pointer is over something that scrolls vertically on its own.
 * Those keep their native behaviour — the page should not glide because the
 * mobile menu or a form was scrolled.
 *
 * The 1px tolerance is not cosmetic. The portfolio and specialist carousels
 * set `overflow-x: auto`, and CSS computes the *other* axis to `auto` the
 * moment one axis is not `visible` — so every rail on the site looks like a
 * vertical scroller to this test. Sub-pixel row heights are enough to put
 * `scrollHeight` a fraction above `clientHeight`, which would hand the wheel
 * back to the browser whenever the pointer crossed a carousel.
 */
function overNestedScroller(node: EventTarget | null) {
  let el = node instanceof Element ? node : null;

  while (el && el !== document.body && el !== document.documentElement) {
    // The cheap test first: most elements cannot scroll, and computing style
    // for every ancestor of every wheel event would not be free.
    if (el.scrollHeight - el.clientHeight > 1) {
      const overflowY = getComputedStyle(el).overflowY;
      if (overflowY === 'auto' || overflowY === 'scroll') return true;
    }
    el = el.parentElement;
  }

  return false;
}

function onWheel(event: WheelEvent) {
  // Pinch-zoom on a trackpad arrives as a ctrl-wheel. Never ours.
  if (event.ctrlKey || event.defaultPrevented) return;
  if (overNestedScroller(event.target)) return;

  let delta = event.deltaY;
  if (event.deltaMode === 1) delta *= LINE_HEIGHT;
  else if (event.deltaMode === 2) delta *= window.innerHeight;
  if (delta === 0) return;

  // Pick the travel up from where the page actually is. This has to happen
  // before `next` is derived, or a gesture that follows a keypress or an
  // anchor jump would extend a target left over from the previous one.
  if (!driving) {
    current = target = window.scrollY;
  }

  // At either end, hand the gesture back so the browser can do its own
  // overscroll and a trackpad can still flick between scroll containers.
  const next = Math.min(limit, Math.max(0, target + delta));
  if (next === target) return;

  event.preventDefault();
  driving = true;
  target = next;

  if (!rafId) {
    lastTime = 0;
    rafId = requestAnimationFrame(tick);
  }
}

/**
 * Anything that scrolled the page without going through the wheel — a
 * scrollbar drag, a keypress, an anchor, a route change restoring the top.
 * The loop adopts that position rather than fighting it.
 */
function onNativeScroll() {
  if (driving) return;
  target = current = window.scrollY;
}

function onResize() {
  measureLimit();
  target = Math.min(target, limit);
}

/** Mounted once above the routes. Renders nothing. */
export function SmoothScroll() {
  useEffect(() => {
    // Scroll-linked momentum is exactly what this preference exists to stop.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    measureLimit();
    target = current = window.scrollY;

    // Images and fonts land late and change the document's height under us.
    const content = new ResizeObserver(onResize);
    content.observe(document.documentElement);

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('scroll', onNativeScroll, { passive: true });
    window.addEventListener('resize', onResize);

    return () => {
      content.disconnect();
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('scroll', onNativeScroll);
      window.removeEventListener('resize', onResize);
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
      lastTime = 0;
      driving = false;
    };
  }, []);

  return null;
}

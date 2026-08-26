import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Drives the horizontal route transition directly against the browser's View
 * Transitions API.
 *
 * React Router can start a view transition for us (`<Link viewTransition>`),
 * but it owns the whole thing: it decides when to call the API and gives the
 * snapshots no way to know which way the visitor is travelling. The direction
 * is the entire point of this transition, so the API is called here instead.
 * Only the base API is needed — no per-type classes — so support reaches back
 * as far as view transitions themselves do.
 *
 * The API wants a callback that mutates the DOM and resolves once the new
 * state is in place. A client-side route change is not synchronous — React
 * Router runs it inside a transition, and a code-split page has a chunk to
 * fetch first — so the callback hands back a promise that `RouteTransitionRunner`
 * resolves once the pathname has actually changed. Without that the browser
 * snapshots the "new" state before the new page exists and cross-fades a page
 * into itself.
 */

let pendingCommit: (() => void) | null = null;
let safetyTimer: ReturnType<typeof setTimeout> | null = null;

/** How long to wait for a route to commit before giving up on the animation. */
const COMMIT_TIMEOUT = 1500;

/**
 * Registers the resolver for the navigation now in flight. A transition that
 * never resolves leaves the page frozen under the overlay, so the timer is not
 * optional — a route can fail to commit for reasons that have nothing to do
 * with this (a redirect, a slow chunk, a click on the current page).
 */
export function awaitCommit(resolve: () => void) {
  clearPending();

  pendingCommit = resolve;
  safetyTimer = setTimeout(() => {
    const commit = pendingCommit;
    pendingCommit = null;
    safetyTimer = null;
    commit?.();
  }, COMMIT_TIMEOUT);
}

/** Called once the new route is on screen. */
export function commitReached() {
  const commit = pendingCommit;
  clearPending();
  commit?.();
}

function clearPending() {
  if (safetyTimer !== null) clearTimeout(safetyTimer);
  safetyTimer = null;
  pendingCommit = null;
}

/**
 * Tells the running view transition that the new route is on screen.
 *
 * Mounted once, above the routes, so it survives every navigation. The effect
 * fires after React has committed the new page to the DOM but before the
 * browser paints, which is exactly the point the API wants to take its "new"
 * snapshot. It must be mounted *after* `ScrollManager` so the page has already
 * been returned to the top when that snapshot is taken — otherwise the new
 * page slides in still showing the old page's scroll offset.
 *
 * Renders nothing.
 */
export function RouteTransitionRunner() {
  const { pathname } = useLocation();
  const first = useRef(true);

  useEffect(() => {
    // The initial mount is not a navigation, so there is nothing waiting.
    if (first.current) {
      first.current = false;
      return;
    }

    commitReached();
  }, [pathname]);

  return null;
}

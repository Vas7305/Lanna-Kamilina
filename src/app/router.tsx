import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { routes } from '@/lib/routes';
import { Layout, ScrollManager } from './Layout';
import { HomePage } from '@/pages/HomePage';

/**
 * Routing.
 *
 * The homepage ships in the initial bundle; everything else is split, so a
 * visitor arriving from Yandex on a phone downloads the landing page and
 * nothing more. Paths are transliterated Russian — see `lib/routes.ts`.
 */

const WorksPage = lazy(() => import('@/pages/WorksPage').then((m) => ({ default: m.WorksPage })));
const WorkPage = lazy(() => import('@/pages/WorkPage').then((m) => ({ default: m.WorkPage })));
const ServicesPage = lazy(() =>
  import('@/pages/ServicesPage').then((m) => ({ default: m.ServicesPage })),
);
const ServicePage = lazy(() =>
  import('@/pages/ServicePage').then((m) => ({ default: m.ServicePage })),
);
const SpecialistsPage = lazy(() =>
  import('@/pages/SpecialistsPage').then((m) => ({ default: m.SpecialistsPage })),
);
const SpecialistPage = lazy(() =>
  import('@/pages/SpecialistPage').then((m) => ({ default: m.SpecialistPage })),
);
const DiscoveryPage = lazy(() =>
  import('@/pages/DiscoveryPage').then((m) => ({ default: m.DiscoveryPage })),
);
const AboutPage = lazy(() => import('@/pages/AboutPage').then((m) => ({ default: m.AboutPage })));
const ContactsPage = lazy(() =>
  import('@/pages/ContactsPage').then((m) => ({ default: m.ContactsPage })),
);
const BookingPage = lazy(() =>
  import('@/pages/BookingPage').then((m) => ({ default: m.BookingPage })),
);
const BookingDonePage = lazy(() =>
  import('@/pages/BookingDonePage').then((m) => ({ default: m.BookingDonePage })),
);
const PrivacyPage = lazy(() =>
  import('@/pages/PrivacyPage').then((m) => ({ default: m.PrivacyPage })),
);
const NotFoundPage = lazy(() =>
  import('@/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })),
);

/** Deliberately quiet: a spinner on a fast connection is visual noise. */
function RouteFallback() {
  return (
    <div className="shell section-y" role="status" aria-live="polite">
      <span className="sr-only">Загрузка</span>
      <div className="h-6 w-40 animate-pulse bg-paper-2" />
      <div className="mt-6 h-[40vh] animate-pulse bg-paper-2" />
    </div>
  );
}

export function AppRoutes() {
  return (
    <>
      <ScrollManager />
      <Routes>
        <Route element={<Layout />}>
          <Route path={routes.home} element={<HomePage />} />

          <Route
            path={routes.works}
            element={
              <Suspense fallback={<RouteFallback />}>
                <WorksPage />
              </Suspense>
            }
          />
          <Route
            path={`${routes.works}/:slug`}
            element={
              <Suspense fallback={<RouteFallback />}>
                <WorkPage />
              </Suspense>
            }
          />

          <Route
            path={routes.services}
            element={
              <Suspense fallback={<RouteFallback />}>
                <ServicesPage />
              </Suspense>
            }
          />
          <Route
            path={`${routes.services}/:slug`}
            element={
              <Suspense fallback={<RouteFallback />}>
                <ServicePage />
              </Suspense>
            }
          />

          <Route
            path={routes.specialists}
            element={
              <Suspense fallback={<RouteFallback />}>
                <SpecialistsPage />
              </Suspense>
            }
          />
          <Route
            path={`${routes.specialists}/:slug`}
            element={
              <Suspense fallback={<RouteFallback />}>
                <SpecialistPage />
              </Suspense>
            }
          />

          <Route
            path={routes.discovery}
            element={
              <Suspense fallback={<RouteFallback />}>
                <DiscoveryPage />
              </Suspense>
            }
          />
          <Route
            path={routes.about}
            element={
              <Suspense fallback={<RouteFallback />}>
                <AboutPage />
              </Suspense>
            }
          />
          <Route
            path={routes.contacts}
            element={
              <Suspense fallback={<RouteFallback />}>
                <ContactsPage />
              </Suspense>
            }
          />

          <Route
            path={routes.booking}
            element={
              <Suspense fallback={<RouteFallback />}>
                <BookingPage />
              </Suspense>
            }
          />
          <Route
            path={routes.bookingDone}
            element={
              <Suspense fallback={<RouteFallback />}>
                <BookingDonePage />
              </Suspense>
            }
          />
          <Route
            path={routes.privacy}
            element={
              <Suspense fallback={<RouteFallback />}>
                <PrivacyPage />
              </Suspense>
            }
          />

          <Route
            path="*"
            element={
              <Suspense fallback={<RouteFallback />}>
                <NotFoundPage />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </>
  );
}

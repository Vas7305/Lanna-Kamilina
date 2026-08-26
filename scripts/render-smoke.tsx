/**
 * Render smoke test.
 *
 * A 200 from the dev server only proves that `index.html` was served — an SPA
 * returns 200 for a page that crashes on first paint. This renders every route
 * through react-dom/server and fails on any thrown error, so a broken page
 * cannot reach a review unnoticed.
 *
 * It exercises render only: effects, layout and interaction still need a real
 * browser. What it does catch is the class of bug that makes a page blank.
 *
 * Run with: npm run smoke
 */

import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { CtaProvider } from '../src/app/CtaContext';
import { HomePage } from '../src/pages/HomePage';
import { WorksPage } from '../src/pages/WorksPage';
import { WorkPage } from '../src/pages/WorkPage';
import { ServicesPage } from '../src/pages/ServicesPage';
import { ServicePage } from '../src/pages/ServicePage';
import { SpecialistsPage } from '../src/pages/SpecialistsPage';
import { SpecialistPage } from '../src/pages/SpecialistPage';
import { DiscoveryPage } from '../src/pages/DiscoveryPage';
import { AboutPage } from '../src/pages/AboutPage';
import { ContactsPage } from '../src/pages/ContactsPage';
import { BookingPage } from '../src/pages/BookingPage';
import { BookingDonePage } from '../src/pages/BookingDonePage';
import { PrivacyPage } from '../src/pages/PrivacyPage';
import { NotFoundPage } from '../src/pages/NotFoundPage';
import { Route, Routes } from 'react-router-dom';
import { portfolio, services, specialists } from '../src/data/index';

interface Case {
  name: string;
  url: string;
  path: string;
  element: React.ReactElement;
  /**
   * The page is expected to render nothing and redirect instead — reaching
   * the confirmation page without a booking in navigation state, for example.
   */
  redirects?: boolean;
}

const cases: Case[] = [
  { name: 'home', url: '/', path: '/', element: <HomePage /> },
  { name: 'works', url: '/raboty', path: '/raboty', element: <WorksPage /> },
  {
    name: 'works filtered',
    url: '/raboty?tag=blond&master=marina',
    path: '/raboty',
    element: <WorksPage />,
  },
  {
    name: 'works empty filter',
    url: '/raboty?tag=nesushchestvuyushchiy-tag',
    path: '/raboty',
    element: <WorksPage />,
  },
  { name: 'services', url: '/uslugi', path: '/uslugi', element: <ServicesPage /> },
  {
    name: 'services category',
    url: '/uslugi?category=okrashivanie',
    path: '/uslugi',
    element: <ServicesPage />,
  },
  { name: 'specialists', url: '/mastera', path: '/mastera', element: <SpecialistsPage /> },
  { name: 'discovery', url: '/podbor', path: '/podbor', element: <DiscoveryPage /> },
  { name: 'about', url: '/o-nas', path: '/o-nas', element: <AboutPage /> },
  { name: 'contacts', url: '/kontakty', path: '/kontakty', element: <ContactsPage /> },
  { name: 'booking', url: '/zapis', path: '/zapis', element: <BookingPage /> },
  {
    name: 'booking deep link',
    url: '/zapis?service=blond&specialist=marina',
    path: '/zapis',
    element: <BookingPage />,
  },
  {
    name: 'booking done without state',
    url: '/zapis/gotovo',
    path: '/zapis/gotovo',
    element: <BookingDonePage />,
    redirects: true,
  },
  { name: 'privacy', url: '/politika-konfidencialnosti', path: '/politika-konfidencialnosti', element: <PrivacyPage /> },
  { name: '404', url: '/net-takoy-stranicy', path: '/net-takoy-stranicy', element: <NotFoundPage /> },
  { name: 'unknown work slug', url: '/raboty/net-takoy', path: '/raboty/:slug', element: <WorkPage /> },
];

// Every detail page, not a sample: a single bad record in the catalogue should
// fail the build rather than one page in production.
for (const service of services) {
  cases.push({
    name: `service: ${service.slug}`,
    url: `/uslugi/${service.slug}`,
    path: '/uslugi/:slug',
    element: <ServicePage />,
  });
}

for (const specialist of specialists) {
  cases.push({
    name: `specialist: ${specialist.slug}`,
    url: `/mastera/${specialist.slug}`,
    path: '/mastera/:slug',
    element: <SpecialistPage />,
  });
  cases.push({
    name: `specialist + service context: ${specialist.slug}`,
    url: `/mastera/${specialist.slug}?service=blond`,
    path: '/mastera/:slug',
    element: <SpecialistPage />,
  });
}

for (const item of portfolio) {
  cases.push({
    name: `work: ${item.slug}`,
    url: `/raboty/${item.slug}`,
    path: '/raboty/:slug',
    element: <WorkPage />,
  });
}

let failures = 0;
let emptyRenders = 0;

for (const testCase of cases) {
  try {
    const html = renderToString(
      <StaticRouter location={testCase.url}>
        <CtaProvider>
          <Routes>
            <Route path={testCase.path} element={testCase.element} />
          </Routes>
        </CtaProvider>
      </StaticRouter>,
    );

    // A page that renders nothing is a failure that throws no error — except
    // where an empty render is the redirect doing its job.
    const text = html.replace(/<[^>]+>/g, '').trim();
    if (testCase.redirects) {
      if (text.length >= 40) {
        console.error(`✗ ${testCase.name} (${testCase.url}) rendered content instead of redirecting`);
        emptyRenders += 1;
      }
    } else if (text.length < 40) {
      console.error(`✗ ${testCase.name} (${testCase.url}) rendered almost nothing`);
      emptyRenders += 1;
    }
  } catch (error) {
    failures += 1;
    console.error(`✗ ${testCase.name} (${testCase.url})`);
    console.error(`  ${(error as Error).message}`);
  }
}

if (failures || emptyRenders) {
  console.error(`\n${failures} render error(s), ${emptyRenders} empty render(s) across ${cases.length} routes`);
  process.exit(1);
}

console.log(`✓ ${cases.length} routes render without errors`);

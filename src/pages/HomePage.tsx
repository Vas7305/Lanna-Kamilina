import { useSeo } from '@/hooks/useSeo';
import { localBusinessSchema, websiteSchema } from '@/lib/seo';
import { business, reputation } from '@/data';
import { useDeclareCta } from '@/app/CtaContext';
import { Hero } from '@/sections/Hero';
import { DiscoverySection } from '@/sections/DiscoverySection';
import { BeforeAfterSection, ResultsSection } from '@/sections/Results';
import { OccasionsSection, ServicesSection, SpecialistsSection } from '@/sections/Offering';
import { ExperienceSection, HeritageSection, ProofStrip } from '@/sections/Story';
import { LocationSection, ReviewsSection } from '@/sections/Trust';

/**
 * Homepage.
 *
 * Ordered as the decision is actually made: desire → discovery → results →
 * proof → services → people → history → reputation → location. Booking is
 * reachable from every one of those blocks rather than being a destination the
 * visitor has to navigate to.
 */
export function HomePage() {
  useSeo({
    title: 'Lanna Kamilina — салон красоты в центре Москвы с 1999 года',
    description:
      'Стрижки, окрашивание и блонд, укладки, макияж, брови и уход в центре Москвы. Работы мастеров, открытые цены, свободное время и запись онлайн без звонка.',
    path: '/',
    jsonLd: [websiteSchema(), localBusinessSchema(business, reputation)],
  });

  useDeclareCta({ label: 'Подобрать образ или записаться', from: 'home-sticky' });

  return (
    <>
      <Hero />
      <ProofStrip />
      <DiscoverySection />
      <ResultsSection />
      <BeforeAfterSection />
      <ServicesSection />
      <SpecialistsSection />
      <OccasionsSection />
      <HeritageSection />
      <ExperienceSection />
      <ReviewsSection />
      <LocationSection />
    </>
  );
}

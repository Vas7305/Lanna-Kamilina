import { routes } from '@/lib/routes';
import { getRecentReviews } from '@/data';
import { SectionHeader } from '@/components/Typo';
import { TextLink } from '@/components/Button';
import { Figure } from '@/components/Figure';
import { ReputationStrip, ReviewList } from '@/features/reviews/Reviews';
import { ContactChannels, MapLinks, OpeningHoursList } from '@/components/ContactLinks';

/**
 * Reputation.
 *
 * Ratings from the platforms a Moscow customer already checks, then a handful
 * of reviews. Deliberately short: the persuasive reviews are the contextual
 * ones on service and specialist pages, and a wall of praise here would only
 * dilute them.
 */
export function ReviewsSection() {
  const reviews = getRecentReviews(3);

  return (
    <section className="section-y" aria-labelledby="reviews-heading">
      <div className="shell">
        <SectionHeader
          eyebrow="Репутация"
          title="Что говорят клиенты"
          lead="Оценки собраны на площадках, где их нельзя отредактировать задним числом."
        />

        <ReputationStrip className="mt-10" />
        <ReviewList reviews={reviews} columns={3} className="mt-12" />
      </div>
    </section>
  );
}

/**
 * Location.
 *
 * A returning customer needs the address, the hours and a route — nothing
 * else. Putting this on the homepage means they never have to navigate to find
 * it, which is most of what "Contacts" traffic actually wants.
 */
export function LocationSection() {
  return (
    <section className="section-y-tight" aria-labelledby="location-heading">
      <div className="shell">
        <div className="grid gap-10 border border-line lg:grid-cols-2">
          <div className="flex min-w-0 flex-col justify-between gap-10 p-8 lg:p-12">
            <div>
              <SectionHeader
                eyebrow="Как добраться"
                title="Центр Москвы"
                action={<TextLink to={routes.contacts}>Контакты</TextLink>}
              />
              <div className="mt-8">
                <ContactChannels surface="home-location" />
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div>
                <p className="type-eyebrow mb-3 text-muted">Часы работы</p>
                <OpeningHoursList />
              </div>
              <MapLinks surface="home-location" />
            </div>
          </div>

          <div className="relative min-h-[18rem] min-w-0 border-t border-line lg:border-t-0 lg:border-l">
            <Figure
              image={{ alt: 'Салон Lanna Kamilina в центре Москвы', seed: 'location-map' }}
              ratio="landscape"
              className="h-full w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

import { bookingLink, routes } from '@/lib/routes';
import { track } from '@/lib/analytics';
import { formatRating, formatYears } from '@/lib/format';
import { getAverageRating, getTotalReviewCount, yearsInBusiness } from '@/data';
import { heroDetail, heroPortrait } from '@/data/photos';
import { ButtonLink } from '@/components/Button';
import { Figure } from '@/components/Figure';
import { Stars } from '@/components/Meta';

/**
 * Homepage hero.
 *
 * Opens with desire, not with a greeting and not with a service menu. Three
 * facts arrive in the first two seconds — what this is, where it is, how long
 * it has been there — and two routes leave it: discovery for people who do not
 * yet know what they want, results for people who want proof first.
 *
 * "Записаться" is deliberately not the hero's primary button. Nobody books a
 * salon they have not yet been persuaded by.
 */
export function Hero() {
  const rating = getAverageRating();
  const reviewCount = getTotalReviewCount();

  return (
    <section className="relative overflow-hidden pt-[var(--header-h)]">
      <div className="shell relative">
        <div className="grid items-end gap-10 pt-10 pb-14 lg:grid-cols-12 lg:gap-8 lg:pt-20 lg:pb-24">
          <div className="lg:col-span-6 xl:col-span-5">
            <p className="type-eyebrow animate-fade-up text-muted">
              Москва · с 1999 года
            </p>

            <h1
              className="type-hero animate-fade-up mt-6"
              style={{ animationDelay: '60ms' }}
            >
              Красота,
              <br />
              созданная
              <br />
              <em className="font-normal italic">именно для вас.</em>
            </h1>

            <p
              className="type-lead animate-fade-up mt-7 max-w-md"
              style={{ animationDelay: '120ms' }}
            >
              Салон в центре Москвы, где сначала смотрят на вас, а потом выбирают процедуру.
              {' '}
              {formatYears(yearsInBusiness)} практики, работы мастеров и открытые цены — до записи,
              а не после.
            </p>

            <div
              className="animate-fade-up mt-9 flex flex-col gap-3 sm:flex-row"
              style={{ animationDelay: '180ms' }}
            >
              <ButtonLink
                to={routes.discovery}
                size="lg"
                onClick={() => track('hero_cta_clicked', { cta: 'discovery' })}
              >
                Подобрать образ
              </ButtonLink>
              <ButtonLink
                to={routes.works}
                variant="secondary"
                size="lg"
                onClick={() => track('hero_cta_clicked', { cta: 'works' })}
              >
                Посмотреть работы
              </ButtonLink>
            </div>

            <div
              className="animate-fade-up mt-10 flex flex-wrap items-center gap-x-6 gap-y-3"
              style={{ animationDelay: '240ms' }}
            >
              <span className="flex items-center gap-2">
                <Stars value={rating} className="text-accent" size={13} />
                <span className="numeric type-small font-medium">{formatRating(rating)}</span>
                <span className="type-small text-muted">
                  · {reviewCount} отзывов на Яндексе и 2ГИС
                </span>
              </span>
              <span className="type-small text-muted">
                <span className="text-ink">Запись онлайн</span> — без звонка
              </span>
            </div>
          </div>

          {/* Two offset frames: one anchor image, one detail. Reads as a spread. */}
          <div className="relative lg:col-span-6 lg:col-start-7 xl:col-span-7 xl:col-start-6">
            <div className="relative ml-auto w-full max-w-xl">
              <Figure
                image={heroPortrait}
                ratio="portrait"
                priority
                className="grain"
              />
              <div className="absolute -bottom-8 -left-4 w-[42%] max-w-[13rem] sm:-left-8 lg:-left-12">
                <Figure
                  image={heroDetail}
                  ratio="square"
                  priority
                  className="border-8 border-paper"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Marquee of what the salon actually does — orientation without a menu. */}
      <div className="hairline">
        <div className="shell flex flex-wrap items-center gap-x-8 gap-y-2 py-5">
          {['Стрижки', 'Окрашивание', 'Блонд', 'Укладки', 'Макияж', 'Брови', 'Ногти', 'Свадебные образы'].map(
            (label) => (
              <span key={label} className="type-meta text-muted uppercase">
                {label}
              </span>
            ),
          )}
        </div>
      </div>
    </section>
  );
}

/** Booking entry used by pages that need a hero-weight call to action. */
export function HeroBookingLink({ from }: { from: string }) {
  return (
    <ButtonLink
      to={bookingLink({ from })}
      size="lg"
      onClick={() => track('booking_started', { from })}
    >
      Посмотреть свободное время
    </ButtonLink>
  );
}

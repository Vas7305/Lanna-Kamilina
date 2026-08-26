import { useSeo } from '@/hooks/useSeo';
import { breadcrumbSchema, localBusinessSchema } from '@/lib/seo';
import { bookingLink, routes } from '@/lib/routes';
import { track } from '@/lib/analytics';
import { business, placeholders, reputation } from '@/data';
import { useDeclareCta } from '@/app/CtaContext';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { SectionHeader } from '@/components/Typo';
import { ButtonLink } from '@/components/Button';
import { Figure } from '@/components/Figure';
import { PlaceholderToken } from '@/components/Meta';
import { ContactChannels, MapLinks, OpeningHoursList } from '@/components/ContactLinks';

/**
 * Contacts.
 *
 * A secondary conversion surface, not the business model — booking stays the
 * primary action even here. Values the salon has not supplied yet render as
 * visible placeholder tokens rather than as invented details.
 */
export function ContactsPage() {
  useSeo({
    title: 'Контакты — салон красоты Lanna Kamilina в центре Москвы',
    description:
      'Адрес, телефон, часы работы и маршрут до салона Lanna Kamilina в центре Москвы. Запись онлайн, Telegram и WhatsApp, Яндекс Карты и 2ГИС.',
    path: routes.contacts,
    jsonLd: [
      localBusinessSchema(business, reputation),
      breadcrumbSchema([
        { name: 'Главная', path: routes.home },
        { name: 'Контакты', path: routes.contacts },
      ]),
    ],
  });

  useDeclareCta({ label: 'Записаться онлайн', from: 'contacts-sticky' });

  return (
    <div className="section-y-tight">
      <div className="shell">
        <Breadcrumbs
          items={[{ name: 'Главная', path: routes.home }, { name: 'Контакты' }]}
          className="mb-8"
        />

        <SectionHeader
          eyebrow="Контакты"
          as="h1"
          title="Найти нас"
          lead="Записаться можно онлайн — свободное время видно сразу. Позвонить или написать стоит, если нужен нестандартный вариант: выезд, сопровождение, срочный визит."
          action={
            <ButtonLink
              to={bookingLink({ from: 'contacts' })}
              size="lg"
              onClick={() => track('booking_started', { from: 'contacts' })}
            >
              Записаться онлайн
            </ButtonLink>
          }
        />

        <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="flex flex-col gap-10">
              <div>
                <p className="type-eyebrow mb-4 text-muted">Адрес</p>
                {business.address ? (
                  <p className="type-subtitle">{business.address}</p>
                ) : (
                  <PlaceholderToken className="type-subtitle">{placeholders.address}</PlaceholderToken>
                )}
                <p className="type-small mt-2 text-muted">
                  {business.metro ? `м. ${business.metro}` : <PlaceholderToken>{placeholders.metro}</PlaceholderToken>}
                  {' · '}
                  {business.legalCity}
                </p>
              </div>

              <div>
                <p className="type-eyebrow mb-4 text-muted">Часы работы</p>
                <OpeningHoursList />
              </div>

              <div>
                <p className="type-eyebrow mb-4 text-muted">Связаться</p>
                <ContactChannels surface="contacts" />
              </div>

              <div>
                <p className="type-eyebrow mb-4 text-muted">Маршрут</p>
                <MapLinks surface="contacts" />
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <Figure
              image={{ alt: 'Расположение салона Lanna Kamilina в Москве', seed: 'contacts-map' }}
              ratio="landscape"
              priority
            >
              <div className="absolute inset-0 flex items-end p-6">
                <p className="type-small max-w-sm bg-paper/90 p-4">
                  Карта подключается вместе с реальным адресом салона: точка на Яндекс Картах и
                  2ГИС, маршрут от метро и парковка.
                </p>
              </div>
            </Figure>

            <div className="mt-10 border border-line p-8">
              <h2 className="type-subtitle">Перед первым визитом</h2>
              <ul className="mt-5 flex flex-col gap-4">
                {[
                  'Приходите с волосами в обычном состоянии — так мастеру проще оценить, как они себя ведут.',
                  'Если раньше были окрашивания хной или басмой, скажите об этом до начала работы.',
                  'На сложный цвет закладывайте больше времени, чем указано минимально: длина и густота влияют сильно.',
                  'Опаздываете — предупредите. Мы постараемся сохранить запись, но иногда придётся сократить программу.',
                ].map((tip) => (
                  <li key={tip} className="type-small flex gap-3 text-ink-2">
                    <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useSeo } from '@/hooks/useSeo';
import { breadcrumbSchema } from '@/lib/seo';
import { bookingLink, routes } from '@/lib/routes';
import { track } from '@/lib/analytics';
import { specialists } from '@/data';
import { useDeclareCta } from '@/app/CtaContext';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { SectionHeader } from '@/components/Typo';
import { ButtonLink } from '@/components/Button';
import { SpecialistCard } from '@/features/specialists/SpecialistCard';

/**
 * The team.
 *
 * Ends with the escape hatch that matters: booking without choosing anyone.
 * Forcing a stranger to pick between six names they do not know is a common
 * way to lose a first-time customer at the last step.
 */
export function SpecialistsPage() {
  useSeo({
    title: 'Мастера салона — колористы, стилисты, визажисты | Lanna Kamilina, Москва',
    description:
      'Команда салона Lanna Kamilina в центре Москвы: колористы, стилисты-парикмахеры, визажист, косметолог и мастер маникюра. Опыт, работы, отзывы и запись к конкретному мастеру.',
    path: routes.specialists,
    jsonLd: [
      breadcrumbSchema([
        { name: 'Главная', path: routes.home },
        { name: 'Мастера', path: routes.specialists },
      ]),
    ],
  });

  useDeclareCta({ label: 'Записаться к мастеру', from: 'specialists-sticky' });

  return (
    <div className="section-y-tight">
      <div className="shell">
        <Breadcrumbs
          items={[{ name: 'Главная', path: routes.home }, { name: 'Мастера' }]}
          className="mb-8"
        />

        <SectionHeader
          eyebrow="Команда"
          as="h1"
          title="Мастера"
          lead="У каждого мастера — своя специализация и свои работы. Посмотрите портфолио: это надёжнее, чем выбирать по фотографии."
        />

        <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {specialists.map((specialist, index) => (
            <SpecialistCard key={specialist.id} specialist={specialist} priority={index < 3} />
          ))}
        </div>

        <div className="mt-20 flex flex-col items-start gap-5 border border-line bg-paper-2/50 p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10">
          <div className="max-w-xl">
            <h2 className="type-title">Не важно, кто именно?</h2>
            <p className="type-small mt-3 text-muted">
              Запишитесь без предпочтения по мастеру — услугу выполнит любой свободный
              специалист нужного профиля. Свободного времени в этом варианте обычно больше.
            </p>
          </div>
          <ButtonLink
            to={bookingLink({ specialist: 'any', from: 'specialists-any' })}
            size="lg"
            className="shrink-0"
            onClick={() => track('booking_started', { from: 'specialists-any' })}
          >
            Записаться без предпочтения
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}

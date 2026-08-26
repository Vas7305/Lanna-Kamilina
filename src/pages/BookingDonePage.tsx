import { Navigate, useLocation } from 'react-router-dom';
import type { BookingConfirmation } from '@/types';
import { ANY_SPECIALIST } from '@/types';
import { useSeo } from '@/hooks/useSeo';
import { routes } from '@/lib/routes';
import { formatDateLabel, formatDuration, formatPrice, formatPhone } from '@/lib/format';
import { business, getService, getSpecialist, placeholders } from '@/data';
import { useDeclareCta } from '@/app/CtaContext';
import { ButtonLink } from '@/components/Button';
import { PlaceholderToken } from '@/components/Meta';
import { phoneHref } from '@/lib/format';
import { track } from '@/lib/analytics';

/**
 * Confirmation.
 *
 * The confirmation lives in navigation state, so a refresh or a shared link
 * lands back on the booking form rather than showing a phantom appointment.
 * The reference code is quotable on the phone, which is what an administrator
 * will actually ask for.
 */
export function BookingDonePage() {
  const location = useLocation();
  const confirmation = location.state as BookingConfirmation | null;

  useSeo({
    title: 'Запись отправлена — Lanna Kamilina',
    description: 'Заявка на запись отправлена. Администратор подтвердит время.',
    path: routes.bookingDone,
    noindex: true,
  });

  useDeclareCta({ label: 'Готово', from: 'booking-done', hidden: true });

  if (!confirmation?.request) {
    return <Navigate to={routes.booking} replace />;
  }

  const { request } = confirmation;
  const service = getService(request.serviceId);
  const specialist =
    request.specialist === ANY_SPECIALIST ? null : getSpecialist(request.specialist);

  return (
    <div className="section-y">
      <div className="shell">
        <div className="max-w-2xl">
          <span
            aria-hidden="true"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-positive text-positive"
          >
            <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.4">
              <path d="M4.5 10.5l3.5 3.5 7.5-8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>

          <h1 className="type-display mt-7">Заявка отправлена</h1>
          <p className="type-lead mt-5">
            Администратор подтвердит запись по телефону. Если что-то изменится, назовите номер
            заявки — так мы найдём вас быстрее.
          </p>

          <div className="mt-10 border border-line">
            <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-line bg-paper-2/60 px-6 py-4">
              <span className="type-eyebrow text-muted">Номер заявки</span>
              <span className="numeric type-subtitle">{confirmation.reference}</span>
            </div>

            <dl className="flex flex-col gap-4 px-6 py-6">
              <Row label="Услуга" value={service?.title} />
              <Row label="Мастер" value={specialist?.name ?? 'Без предпочтения'} />
              <Row
                label="Когда"
                value={`${formatDateLabel(request.date)}, ${request.time}`}
              />
              <Row
                label="Длительность"
                value={service ? formatDuration(service.duration) : undefined}
              />
              <Row label="Стоимость" value={service ? formatPrice(service.price) : undefined} />
              <Row label="Имя" value={request.name} />
              <Row label="Телефон" value={request.phone} />
            </dl>
          </div>

          <p className="type-small mt-6 text-muted">
            Нужно перенести или отменить визит? Позвоните в салон —{' '}
            {business.phone ? (
              <a
                href={phoneHref(business.phone)}
                onClick={() => track('phone_clicked', { surface: 'booking-done' })}
                className="border-b border-line-strong pb-0.5 text-ink transition-colors hover:border-ink"
              >
                {formatPhone(business.phone)}
              </a>
            ) : (
              <PlaceholderToken>{placeholders.phone}</PlaceholderToken>
            )}
            .
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink to={routes.works} size="lg">
              Посмотреть работы
            </ButtonLink>
            <ButtonLink to={routes.home} variant="secondary" size="lg">
              На главную
            </ButtonLink>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
      <dt className="type-small text-muted">{label}</dt>
      <dd className="type-small text-right">{value}</dd>
    </div>
  );
}

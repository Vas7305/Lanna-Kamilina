import { cn } from '@/lib/utils';
import { business, placeholders } from '@/data';
import { formatPhone, phoneHref, telegramHref, whatsappHref } from '@/lib/format';
import { track } from '@/lib/analytics';
import type { AnalyticsEvent } from '@/lib/analytics';
import { PlaceholderToken } from './Meta';

/**
 * Contact channels.
 *
 * Each channel renders as a real link when the salon has supplied the value,
 * and as a visible placeholder token when it has not — never as an invented
 * number. Every channel reports its own analytics event, since "clicked
 * Telegram" and "clicked phone" are different intents.
 */

interface ChannelProps {
  label: string;
  value: string | null;
  placeholder: string;
  href?: string;
  event: AnalyticsEvent;
  surface: string;
  display?: string;
  className?: string;
  external?: boolean;
}

function Channel({
  label,
  value,
  placeholder,
  href,
  event,
  surface,
  display,
  className,
  external,
}: ChannelProps) {
  if (!value || !href) {
    return (
      <div className={cn('flex flex-col gap-1.5', className)}>
        <span className="type-meta text-muted uppercase">{label}</span>
        <PlaceholderToken>{placeholder}</PlaceholderToken>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <span className="type-meta text-muted uppercase">{label}</span>
      <a
        href={href}
        onClick={() => track(event, { surface })}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        className="type-body w-fit border-b border-line-strong pb-0.5 transition-colors hover:border-ink"
      >
        {display ?? value}
      </a>
    </div>
  );
}

export function ContactChannels({
  surface,
  className,
  layout = 'stack',
}: {
  surface: string;
  className?: string;
  layout?: 'stack' | 'grid';
}) {
  return (
    <div
      className={cn(
        layout === 'grid'
          ? 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'
          : 'flex flex-col gap-5',
        className,
      )}
    >
      <Channel
        label="Телефон"
        value={business.phone}
        placeholder={placeholders.phone}
        href={business.phone ? phoneHref(business.phone) : undefined}
        display={business.phone ? formatPhone(business.phone) : undefined}
        event="phone_clicked"
        surface={surface}
      />
      <Channel
        label="Telegram"
        value={business.telegram}
        placeholder={placeholders.telegram}
        href={business.telegram ? telegramHref(business.telegram) : undefined}
        event="telegram_clicked"
        surface={surface}
        external
      />
      <Channel
        label="WhatsApp"
        value={business.whatsapp}
        placeholder={placeholders.whatsapp}
        href={business.whatsapp ? whatsappHref(business.whatsapp) : undefined}
        display={business.whatsapp ? formatPhone(business.whatsapp) : undefined}
        event="whatsapp_clicked"
        surface={surface}
        external
      />
      <Channel
        label="Адрес"
        value={business.address}
        placeholder={placeholders.address}
        href={business.yandexMapsUrl ?? undefined}
        event="map_clicked"
        surface={surface}
        external
      />
    </div>
  );
}

/** Opening hours. Rows without real times render the placeholder, not "0:00". */
export function OpeningHoursList({ className }: { className?: string }) {
  return (
    <dl className={cn('flex flex-col gap-2', className)}>
      {business.openingHours.map((entry) => (
        <div key={entry.label} className="flex items-baseline justify-between gap-6">
          <dt className="type-small text-muted">{entry.label}</dt>
          <dd className="type-small numeric">
            {entry.opens && entry.closes ? (
              `${entry.opens} – ${entry.closes}`
            ) : (
              <PlaceholderToken>{placeholders.hours}</PlaceholderToken>
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** Map platform links — Yandex and 2GIS are how Moscow actually navigates. */
export function MapLinks({ surface, className }: { surface: string; className?: string }) {
  const links = [
    { label: 'Яндекс Карты', href: business.yandexMapsUrl, token: placeholders.maps },
    { label: '2ГИС', href: business.twoGisUrl, token: placeholders.maps },
  ];

  return (
    <div className={cn('flex flex-wrap items-center gap-3', className)}>
      {links.map((link) =>
        link.href ? (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track('map_clicked', { surface, platform: link.label })}
            className="inline-flex h-10 items-center rounded-xs border border-line-strong px-4 text-[0.8125rem] transition-colors hover:border-ink"
          >
            {link.label}
          </a>
        ) : (
          <span
            key={link.label}
            className="inline-flex h-10 items-center gap-2 rounded-xs border border-dashed border-line-strong px-4 text-[0.8125rem] text-muted"
          >
            {link.label}
            <span className="type-meta">{link.token}</span>
          </span>
        ),
      )}
    </div>
  );
}

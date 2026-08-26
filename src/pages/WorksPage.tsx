import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSeo } from '@/hooks/useSeo';
import { breadcrumbSchema } from '@/lib/seo';
import { routes } from '@/lib/routes';
import { track } from '@/lib/analytics';
import {
  filterPortfolio,
  getActivePortfolioFilters,
  getServiceBySlug,
  getSpecialistBySlug,
} from '@/data';
import { useDeclareCta } from '@/app/CtaContext';
import { Breadcrumbs, EmptyState } from '@/components/Breadcrumbs';
import { SectionHeader } from '@/components/Typo';
import { Button, ButtonLink } from '@/components/Button';
import { PortfolioFilters, PortfolioGrid } from '@/features/portfolio/PortfolioGrid';
import { plural } from '@/lib/utils';

/**
 * Portfolio index.
 *
 * Filters live in the URL, so a filtered view is shareable and a campaign can
 * link straight to «блонд» or to a single specialist's work. That is the whole
 * point of the section: a social post about one result should land on that
 * result, not on a generic gallery.
 */
export function WorksPage() {
  const [params, setParams] = useSearchParams();

  const tag = params.get('tag');
  const masterSlug = params.get('master');
  const serviceSlug = params.get('service');

  const specialist = masterSlug ? getSpecialistBySlug(masterSlug) : undefined;
  const service = serviceSlug ? getServiceBySlug(serviceSlug) : undefined;
  const filters = getActivePortfolioFilters();

  const items = useMemo(
    () =>
      filterPortfolio({
        tag: tag ?? undefined,
        specialistId: specialist?.id,
        serviceId: service?.id,
      }),
    [tag, specialist?.id, service?.id],
  );

  const activeLabel =
    specialist?.name ?? service?.title ?? filters.find((f) => f.tag === tag)?.label ?? null;

  useSeo({
    title: activeLabel
      ? `${activeLabel} — работы мастеров | Lanna Kamilina, Москва`
      : 'Работы мастеров — Lanna Kamilina, салон красоты в Москве',
    description: activeLabel
      ? `Работы салона Lanna Kamilina: ${activeLabel.toLowerCase()}. Фото до и после, мастер, услуга и запись онлайн.`
      : 'Портфолио салона Lanna Kamilina в Москве: окрашивание и блонд, стрижки, укладки, макияж и образы. Фото до и после, мастера и цены.',
    path: routes.works,
    jsonLd: [
      breadcrumbSchema([
        { name: 'Главная', path: routes.home },
        { name: 'Работы', path: routes.works },
      ]),
    ],
  });

  useDeclareCta({
    label: activeLabel ? `Записаться: ${activeLabel.toLowerCase()}` : 'Записаться',
    serviceSlug: service?.slug,
    specialist: specialist?.slug,
    from: 'works-sticky',
  });

  const setFilter = (nextTag: string | null) => {
    const updated = new URLSearchParams(params);
    if (nextTag) updated.set('tag', nextTag);
    else updated.delete('tag');
    setParams(updated);
    track('portfolio_viewed', { tag: nextTag ?? 'all', surface: 'works' });
  };

  const clearAll = () => setParams(new URLSearchParams());

  return (
    <div className="section-y-tight">
      <div className="shell">
        <Breadcrumbs
          items={[{ name: 'Главная', path: routes.home }, { name: 'Работы' }]}
          className="mb-8"
        />

        <SectionHeader
          eyebrow="Портфолио"
          title="Результаты"
          as="h1"
          lead="Реальные работы мастеров салона. У каждой — услуга, мастер и прямой путь к записи."
        />

        <div className="mt-10 flex flex-col gap-4">
          <PortfolioFilters filters={filters} active={tag} onChange={setFilter} />

          {(specialist || service) && (
            <div className="flex flex-wrap items-center gap-3">
              <span className="type-small text-muted">
                {specialist && `Мастер: ${specialist.name}`}
                {specialist && service && ' · '}
                {service && `Услуга: ${service.title}`}
              </span>
              <Button variant="quiet" onClick={clearAll}>
                Сбросить
              </Button>
            </div>
          )}

          <p className="type-meta text-muted" role="status">
            {items.length} {plural(items.length, 'работа', 'работы', 'работ')}
          </p>
        </div>

        <div className="mt-10">
          {items.length > 0 ? (
            <PortfolioGrid items={items} />
          ) : (
            <EmptyState
              title="По этому фильтру работ пока нет"
              body="Мы добавляем новые работы каждую неделю. Посмотрите другие категории или подберите образ — подскажем, что подойдёт."
              action={
                <div className="flex flex-wrap justify-center gap-3">
                  <Button variant="secondary" onClick={clearAll}>
                    Показать все работы
                  </Button>
                  <ButtonLink to={routes.discovery}>Подобрать образ</ButtonLink>
                </div>
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}

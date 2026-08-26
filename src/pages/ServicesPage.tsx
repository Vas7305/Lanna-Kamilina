import { useSearchParams } from 'react-router-dom';
import { useSeo } from '@/hooks/useSeo';
import { breadcrumbSchema } from '@/lib/seo';
import { routes } from '@/lib/routes';
import { track } from '@/lib/analytics';
import { getCategoryBySlug, getServicesByCategory, serviceCategories } from '@/data';
import { useDeclareCta } from '@/app/CtaContext';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { SectionHeader } from '@/components/Typo';
import { Chip } from '@/components/Meta';
import { ButtonLink } from '@/components/Button';
import { ServiceRow } from '@/features/services/ServiceCard';

/**
 * Services and prices.
 *
 * A single scannable price list rather than a funnel of category pages. Prices
 * and durations are visible without a click, and the category chips scroll the
 * page instead of navigating away — comparing across categories is exactly
 * what this page is for.
 */
export function ServicesPage() {
  const [params, setParams] = useSearchParams();
  const activeSlug = params.get('category');
  const activeCategory = activeSlug ? getCategoryBySlug(activeSlug) : undefined;

  const visible = activeCategory ? [activeCategory] : serviceCategories;

  useSeo({
    title: activeCategory
      ? `${activeCategory.title} — цены и услуги | Lanna Kamilina, Москва`
      : 'Услуги и цены — салон красоты Lanna Kamilina в Москве',
    description: activeCategory
      ? `${activeCategory.title}: ${activeCategory.description} Цены, длительность и запись онлайн в салоне Lanna Kamilina в центре Москвы.`
      : 'Полный прайс салона Lanna Kamilina в Москве: стрижки, окрашивание и блонд, укладки, макияж, брови, ресницы, маникюр и свадебные образы. Цены и длительность каждой услуги.',
    path: routes.services,
    jsonLd: [
      breadcrumbSchema([
        { name: 'Главная', path: routes.home },
        { name: 'Услуги', path: routes.services },
      ]),
    ],
  });

  useDeclareCta({ label: 'Записаться на услугу', from: 'services-sticky' });

  const select = (slug: string | null) => {
    const updated = new URLSearchParams(params);
    if (slug) updated.set('category', slug);
    else updated.delete('category');
    setParams(updated);
    track('service_viewed', { category: slug ?? 'all', surface: 'services' });
  };

  return (
    <div className="section-y-tight">
      <div className="shell">
        <Breadcrumbs
          items={[{ name: 'Главная', path: routes.home }, { name: 'Услуги' }]}
          className="mb-8"
        />

        <SectionHeader
          eyebrow="Прайс"
          as="h1"
          title="Услуги и цены"
          lead="Цены открытые. Там, где стоимость зависит от длины волос или сложности, мы пишем «от» и объясняем, что именно на неё влияет."
          action={<ButtonLink to={routes.discovery} variant="secondary">Не знаю, что выбрать</ButtonLink>}
        />

        <div className="rail mt-10 -mx-5 gap-2 px-5 sm:-mx-8 sm:px-8 xl:mx-0 xl:px-0">
          <Chip as="button" active={!activeSlug} onClick={() => select(null)}>
            Все
          </Chip>
          {serviceCategories.map((category) => (
            <Chip
              key={category.id}
              as="button"
              active={activeSlug === category.slug}
              onClick={() => select(activeSlug === category.slug ? null : category.slug)}
            >
              {category.title}
            </Chip>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-16">
          {visible.map((category) => {
            const items = getServicesByCategory(category.id);
            return (
              <section key={category.id} id={category.slug} aria-labelledby={`cat-${category.id}`}>
                <div className="flex flex-col gap-3 border-b border-ink pb-4 md:flex-row md:items-end md:justify-between">
                  <h2 id={`cat-${category.id}`} className="type-title">
                    {category.title}
                  </h2>
                  <p className="type-small max-w-md text-muted">{category.description}</p>
                </div>

                <div className="mt-2">
                  {items.map((service) => (
                    <ServiceRow key={service.id} service={service} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        <p className="type-small mt-14 max-w-2xl border-l border-line-strong pl-5 text-muted">
          Итоговая стоимость называется до начала работы, на консультации. Если результат
          требует нескольких визитов, мастер скажет об этом заранее — вместе с планом и суммой.
        </p>
      </div>
    </div>
  );
}

import { useSeo } from '@/hooks/useSeo';
import { routes } from '@/lib/routes';
import { ButtonLink } from '@/components/Button';
import { getFeaturedPortfolio } from '@/data';
import { PortfolioCard } from '@/features/portfolio/PortfolioCard';

/**
 * 404.
 *
 * A dead end is still traffic that was interested in something. Rather than
 * apologising and stopping, the page offers the two routes that convert:
 * discovery for the undecided, results for the curious.
 */
export function NotFoundPage() {
  useSeo({
    title: 'Страница не найдена — Lanna Kamilina',
    description: 'Такой страницы нет. Посмотрите работы мастеров или подберите образ.',
    path: '/404',
    noindex: true,
  });

  const suggestions = getFeaturedPortfolio(3);

  return (
    <div className="section-y">
      <div className="shell">
        <p className="type-eyebrow text-muted">Ошибка 404</p>
        <h1 className="type-display mt-5 max-w-2xl">Такой страницы нет — но есть работы.</h1>
        <p className="type-lead mt-5 max-w-xl">
          Возможно, ссылка устарела. Начните с портфолио или ответьте на пару вопросов, и мы
          подскажем, что подойдёт.
        </p>

        <div className="mt-9 flex flex-wrap gap-3">
          <ButtonLink to={routes.works} size="lg">
            Посмотреть работы
          </ButtonLink>
          <ButtonLink to={routes.discovery} variant="secondary" size="lg">
            Подобрать образ
          </ButtonLink>
        </div>

        <div className="mt-20 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {suggestions.map((item) => (
            <PortfolioCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

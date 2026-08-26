import { useSearchParams } from 'react-router-dom';
import { useSeo } from '@/hooks/useSeo';
import { breadcrumbSchema } from '@/lib/seo';
import { routes } from '@/lib/routes';
import { useDeclareCta } from '@/app/CtaContext';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { DiscoveryEngine } from '@/features/discovery/DiscoveryEngine';

/**
 * «Не знаю, что выбрать» as a first-class page.
 *
 * A legitimate customer state, and a large share of Moscow search traffic
 * («что сделать с волосами», «какой макияж на свадьбу»). Landing here should
 * feel like getting help, not like being interviewed.
 */
export function DiscoveryPage() {
  const [params] = useSearchParams();
  const startTag = params.get('start') ?? undefined;

  useSeo({
    title: 'Подбор образа — не знаете, что выбрать? | Lanna Kamilina, Москва',
    description:
      'Ответьте на два-три вопроса — и мы подскажем подходящую услугу, покажем работы, назовём цену и длительность, а также свободное время для записи в салоне в центре Москвы.',
    path: routes.discovery,
    jsonLd: [
      breadcrumbSchema([
        { name: 'Главная', path: routes.home },
        { name: 'Подбор образа', path: routes.discovery },
      ]),
    ],
  });

  useDeclareCta({ label: 'Подобрать образ', from: 'discovery-sticky' });

  return (
    <div className="section-y-tight">
      <div className="shell">
        <Breadcrumbs
          items={[{ name: 'Главная', path: routes.home }, { name: 'Подбор образа' }]}
          className="mb-10"
        />

        <div className="max-w-5xl">
          <DiscoveryEngine startTag={startTag} />
        </div>

        <p className="type-small mt-20 max-w-xl border-l border-line-strong pl-5 text-muted">
          Подбор ни к чему не обязывает: это способ сузить выбор, а не оформить запись.
          Окончательное решение всегда принимается вместе с мастером на консультации.
        </p>
      </div>
    </div>
  );
}

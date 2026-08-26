import { useSeo } from '@/hooks/useSeo';
import { routes } from '@/lib/routes';
import { business, placeholders } from '@/data';
import { useDeclareCta } from '@/app/CtaContext';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Prose } from '@/components/Typo';
import { PlaceholderToken } from '@/components/Meta';

/**
 * Privacy notice.
 *
 * Required in practice: the booking form collects a name and a phone number,
 * and Russian personal-data law (152-ФЗ) expects a stated purpose and a way to
 * withdraw consent. The legal entity and contact details are placeholders
 * until the salon supplies them — an invented operator name would be worse
 * than a missing one.
 */
export function PrivacyPage() {
  useSeo({
    title: 'Политика конфиденциальности — Lanna Kamilina',
    description:
      'Как салон Lanna Kamilina обрабатывает персональные данные, оставленные при онлайн-записи.',
    path: routes.privacy,
    noindex: true,
  });

  useDeclareCta({ label: 'Политика', from: 'privacy', hidden: true });

  return (
    <div className="section-y-tight">
      <div className="shell">
        <Breadcrumbs
          items={[{ name: 'Главная', path: routes.home }, { name: 'Политика конфиденциальности' }]}
          className="mb-8"
        />

        <h1 className="type-display max-w-3xl">Политика конфиденциальности</h1>

        <Prose className="mt-10 flex flex-col gap-8">
          <section>
            <h2 className="type-subtitle mb-3">Кто обрабатывает данные</h2>
            <p>
              Оператором персональных данных выступает{' '}
              <PlaceholderToken>[ЮРИДИЧЕСКОЕ ЛИЦО]</PlaceholderToken>, салон {business.name},{' '}
              {business.legalCity}. Контакты для обращений:{' '}
              <PlaceholderToken>{placeholders.email}</PlaceholderToken>,{' '}
              <PlaceholderToken>{placeholders.phone}</PlaceholderToken>.
            </p>
          </section>

          <section>
            <h2 className="type-subtitle mb-3">Какие данные мы собираем</h2>
            <p>
              При онлайн-записи — имя, номер телефона и комментарий, если вы его оставили.
              Дополнительно сохраняются выбранная услуга, мастер, дата и время визита.
              Технические данные (страницы, источник перехода) используются в обезличенном виде
              для веб-аналитики.
            </p>
          </section>

          <section>
            <h2 className="type-subtitle mb-3">Зачем</h2>
            <p>
              Единственная цель — подтвердить и провести визит: связаться с вами, согласовать
              время, напомнить о записи. Данные не передаются третьим лицам для рекламы и не
              продаются.
            </p>
          </section>

          <section>
            <h2 className="type-subtitle mb-3">Как долго хранятся</h2>
            <p>
              Данные о записи хранятся столько, сколько требуется для обслуживания и учёта, после
              чего удаляются или обезличиваются.
            </p>
          </section>

          <section>
            <h2 className="type-subtitle mb-3">Отзыв согласия</h2>
            <p>
              Согласие на обработку персональных данных можно отозвать в любой момент — напишите
              или позвоните по контактам выше. После отзыва мы прекратим обработку, кроме
              случаев, когда закон требует сохранить данные.
            </p>
          </section>

          <p className="type-meta text-muted">
            Текст подготовлен как основа и требует проверки юристом перед публикацией.
          </p>
        </Prose>
      </div>
    </div>
  );
}

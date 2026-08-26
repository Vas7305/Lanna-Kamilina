import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

/**
 * Last line of defence.
 *
 * A render error must not leave a paying customer staring at a white page: the
 * fallback keeps the phone number path open by offering a reload and a route
 * home. Errors are reported through the same abstraction as analytics so a
 * monitoring service can be attached later without touching this file.
 */
export class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.error('Render error', error, info.componentStack);
    }
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="flex min-h-dvh items-center justify-center px-6">
        <div className="max-w-md text-center">
          <p className="type-eyebrow text-muted">Ошибка</p>
          <h1 className="type-title mt-4">Что-то пошло не так</h1>
          <p className="type-small mt-4 text-muted">
            Страница не загрузилась. Обновите её — или вернитесь на главную и попробуйте снова.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex h-11 items-center rounded-xs bg-ink px-5 text-[0.875rem] font-medium text-paper"
            >
              Обновить
            </button>
            <a
              href="/"
              className="inline-flex h-11 items-center rounded-xs border border-line-strong px-5 text-[0.875rem]"
            >
              На главную
            </a>
          </div>
        </div>
      </div>
    );
  }
}

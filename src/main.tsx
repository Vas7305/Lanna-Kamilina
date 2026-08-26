import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './styles/index.css';
import { AppRoutes } from './app/router';
import { CtaProvider } from './app/CtaContext';
import { ErrorBoundary } from './app/ErrorBoundary';
import { consoleSink, dataLayerSink, registerSink } from './lib/analytics';
import { captureAttribution } from './lib/attribution';

/**
 * Entry point.
 *
 * Attribution is captured before the first render so the landing URL — the one
 * a campaign actually paid for — is recorded even if the visitor immediately
 * navigates away. Analytics sinks are registered here and nowhere else; add a
 * Yandex.Metrica counter with `registerSink(createMetricaSink(id))`.
 */

captureAttribution();
registerSink(consoleSink);
registerSink(dataLayerSink);

const container = document.getElementById('root');
if (!container) throw new Error('Root element #root not found');

createRoot(container).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <CtaProvider>
          <AppRoutes />
        </CtaProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
);

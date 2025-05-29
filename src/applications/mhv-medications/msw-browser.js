import { setupWorker } from 'msw/browser';
import { handlers } from './msw-handlers';

// This file initializes MSW for local development
if (process.env.NODE_ENV === 'development') {
  const worker = setupWorker(...handlers);
  worker.start({
    onUnhandledRequest: 'bypass', // Let non-mocked requests through
  });
}

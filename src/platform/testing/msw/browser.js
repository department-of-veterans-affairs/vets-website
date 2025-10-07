/**
 * MSW browser worker for browser environments (local dev, Cypress)
 * This runs in the browser and intercepts fetch/xhr requests
 */
import { setupWorker } from 'msw';
import { defaultHandlers } from './handlers';

export const worker = setupWorker(...defaultHandlers);

/**
 * Start the MSW worker with custom options
 * @param {object} options - MSW worker options
 */
export const startWorker = (options = {}) => {
  return worker.start({
    onUnhandledRequest: 'warn',
    ...options,
  });
};

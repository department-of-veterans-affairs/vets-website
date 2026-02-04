/**
 * AVS Browser Mocks
 *
 * MSW handlers for local development in the browser.
 * Uses shared data from ./data.js
 */
import { setupWorker } from 'msw';
import { rest, createCommonHandlers, apiUrl } from '~/platform/mocks/browser';

import { mockAvs, mockAvsErrors, AVS_API_PATH } from './data';

// AVS-specific handler
const createAvsHandler = baseUrl =>
  rest.get(`${baseUrl}${AVS_API_PATH}/:avsId`, (req, res, ctx) => {
    const { avsId } = req.params;

    if (avsId !== mockAvs.data.id) {
      return res(ctx.status(404), ctx.json(mockAvsErrors.notFound));
    }

    return res(ctx.status(200), ctx.json(mockAvs));
  });

// Create all handlers for the AVS app
export const createAllHandlers = (baseUrl = apiUrl) => [
  createAvsHandler(baseUrl),
  ...createCommonHandlers(baseUrl),
];

// Start mocking - call this from app entry
export const startMocking = async () => {
  const worker = setupWorker(...createAllHandlers());

  return worker.start({
    onUnhandledRequest: 'bypass',
    serviceWorker: {
      url: '/mockServiceWorker.js',
    },
  });
};

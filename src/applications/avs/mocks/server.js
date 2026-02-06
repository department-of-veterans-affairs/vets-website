/**
 * AVS Unit Test Mocks
 *
 * MSW handlers for unit tests using the global mocha-setup server.
 * Uses shared data from ./data.js
 *
 * Usage:
 * import { server } from 'platform/testing/unit/mocha-setup';
 * import { avsHandlers, handlers } from '../../mocks/server';
 *
 * describe('My test', () => {
 *   beforeEach(() => server.use(...avsHandlers));
 *   afterEach(() => server.resetHandlers());
 *
 *   it('handles not found', () => {
 *     server.use(handlers.avsNotFound());
 *   });
 * });
 */
import {
  createGetHandler,
  jsonResponse,
} from 'platform/testing/unit/msw-adapter';
import environment from 'platform/utilities/environment';

import { mockAvs, mockAvsErrors, AVS_API_PATH } from './data';

// Re-export mockAvs for convenience in unit tests
export { mockAvs };

const apiUrl = environment.API_URL;
const avsApiUrl = `${apiUrl}${AVS_API_PATH}`;

// Default AVS handlers - use with server.use(...avsHandlers)
export const avsHandlers = [
  createGetHandler(`${avsApiUrl}/:id`, ({ params }) => {
    if (params.id === mockAvs.data.id) {
      return jsonResponse(mockAvs);
    }
    return jsonResponse(mockAvsErrors.notFound, { status: 404 });
  }),
];

// Handler factory functions for test overrides
export const handlers = {
  avsSuccess: (data = mockAvs) =>
    createGetHandler(`${avsApiUrl}/:id`, () => jsonResponse(data)),

  avsNotFound: () =>
    createGetHandler(`${avsApiUrl}/:id`, () =>
      jsonResponse(mockAvsErrors.notFound, { status: 404 }),
    ),

  avsUnauthorized: () =>
    createGetHandler(`${avsApiUrl}/:id`, () =>
      jsonResponse(mockAvsErrors.unauthorized, { status: 401 }),
    ),

  avsBadRequest: () =>
    createGetHandler(`${avsApiUrl}/:id`, () =>
      jsonResponse(mockAvsErrors.badRequest, { status: 400 }),
    ),

  avsServerError: () =>
    createGetHandler(`${avsApiUrl}/:id`, () =>
      jsonResponse(mockAvsErrors.serverError, { status: 500 }),
    ),
};

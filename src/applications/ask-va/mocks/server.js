/**
 * AskVA Unit Test Mocks
 *
 * MSW handlers for unit tests using the global mocha-setup server.
 * Uses shared data from ../utils/mockData.js
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

import { baseUrl } from '../constants';
// TODO - Fix these imports
// import { mockAvs, mockAvsErrors } from './data';

// Re-export mockAvs for convenience in unit tests
// TODO - change once we have data
// export { mockAvs };

const apiUrl = environment.API_URL;
const askVAApiUrl = `${apiUrl}${baseUrl}`;

// TODO: None of this applies to AskVA

/*
// Default AVS handlers - use with server.use(...avsHandlers)
export const avsHandlers = [
  createGetHandler(`${askVAApiUrl}/:id`, ({ params }) => {
    if (params.id === mockAvs.data.id) {
      return jsonResponse(mockAvs);
    }
    return jsonResponse(mockAvsErrors.notFound, { status: 404 });
  }),
];

// Handler factory functions for test overrides
export const handlers = {
  avsSuccess: (data = mockAvs) =>
    createGetHandler(`${askVAApiUrl}/:id`, () => jsonResponse(data)),

  avsNotFound: () =>
    createGetHandler(`${askVAApiUrl}/:id`, () =>
      jsonResponse(mockAvsErrors.notFound, { status: 404 }),
    ),

  avsUnauthorized: () =>
    createGetHandler(`${askVAApiUrl}/:id`, () =>
      jsonResponse(mockAvsErrors.unauthorized, { status: 401 }),
    ),

  avsBadRequest: () =>
    createGetHandler(`${askVAApiUrl}/:id`, () =>
      jsonResponse(mockAvsErrors.badRequest, { status: 400 }),
    ),

  avsServerError: () =>
    createGetHandler(`${askVAApiUrl}/:id`, () =>
      jsonResponse(mockAvsErrors.serverError, { status: 500 }),
    ),
};
*/
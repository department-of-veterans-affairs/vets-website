/**
 * MSW Adapter Example
 *
 * This file demonstrates how to use the MSW adapter to write tests that
 * work with both MSW v1 (Node 14) and MSW v2 (Node 22).
 */

import {
  createGetHandler,
  createPostHandler,
  jsonResponse,
  networkError,
  textResponse,
} from './msw-adapter';

// Example API endpoint handlers
export const handlers = [
  /**
   * GET user profile handler example
   */
  // eslint-disable-next-line no-unused-vars
  createGetHandler('https://api.va.gov/v0/user', ({ params }) => {
    // Simulate successful response
    return jsonResponse(
      {
        data: {
          id: '123',
          type: 'user',
          attributes: {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
          },
        },
      },
      { status: 200 },
    );
  }),

  /**
   * GET with conditional response example
   */
  createGetHandler('https://api.va.gov/v0/status/:statusType', ({ params }) => {
    if (params.statusType === 'error') {
      // Demonstrate a network error response
      return networkError('SIP Network Error');
    }

    // Normal response
    return jsonResponse({ status: 'OK' });
  }),

  /**
   * POST form submission example
   */
  createPostHandler('https://api.va.gov/v0/submit-form', async ({ body }) => {
    if (!body || !body.formData) {
      // Return an error response for invalid data
      return jsonResponse(
        { error: 'Missing required form data' },
        { status: 400 },
      );
    }

    // Successful submission response
    return jsonResponse(
      {
        data: {
          id: '12345',
          type: 'form-submission',
          attributes: {
            confirmationNumber: 'ABC123',
            submittedAt: new Date().toISOString(),
          },
        },
      },
      { status: 201 },
    );
  }),

  /**
   * Example of responding with text instead of JSON
   */
  createGetHandler('https://api.va.gov/v0/text-response', () => {
    return textResponse('OK', { status: 200 });
  }),
];

/**
 * Usage in tests:
 *
 * import { setupServer } from 'msw/node';
 * import { handlers } from './msw-adapter.example';
 *
 * const server = setupServer(...handlers);
 *
 * beforeAll(() => server.listen());
 * afterEach(() => server.resetHandlers());
 * afterAll(() => server.close());
 */

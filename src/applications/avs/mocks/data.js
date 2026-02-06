/**
 * AVS Mock Data
 *
 * Shared mock data and error responses for AVS.
 * Used by browser mocks, unit tests, and Cypress tests.
 */
import mockAvsData from '../tests/fixtures/9A7AF40B2BC2471EA116891839113252.json';

// Re-export the fixture data
export const mockAvs = mockAvsData;

// Error response templates
export const mockAvsErrors = {
  notFound: {
    errors: [
      {
        title: 'Not found',
        detail: 'No AVS found for the requested ID',
        status: 'not_found',
      },
    ],
  },
  unauthorized: {
    errors: [
      {
        title: 'Not authorized',
        detail: 'User may not view this AVS.',
        status: 'unauthorized',
      },
    ],
  },
  badRequest: {
    errors: [
      {
        title: 'Invalid AVS id',
        detail: 'AVS id does not match accepted format.',
        status: 'bad_request',
      },
    ],
  },
  serverError: {
    errors: [
      {
        title: 'Internal Server Error',
      },
    ],
  },
};

// API path (without base URL)
export const AVS_API_PATH = '/avs/v0/avs';

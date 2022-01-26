import environment from 'platform/utilities/environment';
import * as Sentry from '@sentry/browser';

/**
 * @param {string} slug
 */
const createAnalyticsSlug = slug => {
  return `check-in-${slug}`;
};

/**
 * @typedef {Object} CreateApiEventResponse
 * @property {string} event
 * @property {string} api-name
 * @property {string} api-status
 * @property {number} [api_latency_ms]
 * @property {string} [api-request-id]
 * @property {string} [error-key]
 */

/**
 * @param {string} [name]
 * @param {string} [status]
 * @param {number} [time]
 * @param {string} [token]
 * @param {string} [error]
 * @returns {CreateApiEventResponse}
 */
const createApiEvent = (name, status, time, token, error) => {
  const rv = {
    event: 'api_call',
    'api-name': name,
    'api-status': status,
  };
  if (time) {
    // eslint-disable-next-line camelcase
    rv.api_latency_ms = time;
  }
  if (token) {
    rv['api-request-id'] = token;
  }
  if (error) {
    rv['error-key'] = error;
  }
  return rv;
};

const captureError = error => {
  if (error instanceof Error) {
    Sentry.captureException(error);
  } else {
    Sentry.withScope(scope => {
      scope.setExtra('error', error);

      const message = `check_in_client_error`;
      // the apiRequest helper returns the errors array, instead of an exception
      Sentry.captureMessage(message);
    });
  }
  if (!environment.isProduction()) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
};
export { createAnalyticsSlug, createApiEvent, captureError };

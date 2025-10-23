import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import * as Sentry from '@sentry/browser';
import { APP_NAMES } from '../appConstants';

/**
 * @param {string} slug
 * @param {string} eventType
 */
const createAnalyticsSlug = (slug, eventType = '', app = '') => {
  let prefix = '';
  if (eventType) {
    prefix = `${eventType}-`;
  }
  let context = 'check-in-';
  switch (app) {
    case APP_NAMES.PRE_CHECK_IN:
      context = 'pre-check-in-';
      break;
    case APP_NAMES.TRAVEL_CLAIM:
      context = 'travel-claim-';
      break;
    default:
      break;
  }

  return `${prefix}${context}${slug}`;
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

const ERROR_SOURCES = Object.freeze({
  API: 'api',
  OTHER: 'other',
});

const captureError = (error, details) => {
  if (error instanceof Error) {
    Sentry.withScope(scope => {
      const { token } = details;
      if (token) {
        scope.setContext('token', { token });
      }
      Sentry.captureException(error);
    });
  } else if (error.source === ERROR_SOURCES.API) {
    Sentry.withScope(scope => {
      const { err } = error;
      const { eventName } = details;
      const message = `check_in_client_api_error-${eventName}`;
      scope.setContext(message, { details, err });

      // the apiRequest helper returns the errors array, instead of an exception
      Sentry.captureMessage(message);
    });
  } else {
    Sentry.withScope(scope => {
      const { token } = details;
      const message = `check_in_client_error`;
      scope.setContext(message, {
        token: token || 'no token found',
        error: JSON.stringify(error),
      });

      // the apiRequest helper returns the errors array, instead of an exception
      Sentry.captureMessage(message);
    });
  }
  if (!environment.isProduction()) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
};

export { createAnalyticsSlug, createApiEvent, captureError, ERROR_SOURCES };

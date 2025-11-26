import * as Sentry from '@sentry/browser';
import environment from '~/platform/utilities/environment';
import recordEvent from '~/platform/monitoring/record-event';

const ERROR_SOURCES = Object.freeze({
  API: 'api',
  OTHER: 'other',
});

/**
 * Creates a standardized Google Analytics event object for API calls.
 *
 * @param {Object} options - Event configuration
 * @param {string} [options.name='unknown'] - API endpoint name
 * @param {string} [options.status='unknown'] - API response status
 * @param {number} [options.time] - API latency in milliseconds
 * @param {string} [options.errorKey] - Error key if API call failed
 * @returns {Object} GA event object
 *
 * @example
 * import { createApiEvent } from '@@vap-svc/util/analytics';
 *
 * const event = createApiEvent({
 *   name: 'update-email',
 *   status: 'success',
 *   time: 250
 * });
 */
const createApiEvent = ({
  name = 'unknown',
  status = 'unknown',
  time,
  errorKey,
} = {}) => {
  const rv = {
    event: 'api_call',
    'api-name': name,
    'api-status': status,
  };
  if (time) {
    rv['api-latency-ms'] = time;
  }
  if (errorKey) {
    rv['error-key'] = errorKey;
  }
  return rv;
};

/**
 * Captures and logs errors to Sentry with appropriate context and tags.
 * Handles both API errors and general client errors differently.
 *
 * @param {Error|Object} error - Error object to capture
 * @param {Object} details - Additional error context and details
 * @param {string} details.eventName - Name of the event where error occurred
 *
 * @example
 * import { captureError } from '@@vap-svc/util/analytics';
 *
 * captureError(error, { eventName: 'update-phone-number' });
 */
const captureError = (error, details) => {
  if (environment.isLocalhost()) {
    // eslint-disable-next-line no-console
    console.error({ error, details });
  }

  if (error?.source === ERROR_SOURCES.API) {
    const { eventName } = details;
    Sentry.withScope(scope => {
      scope.setTags({
        'profile-client-api-error': eventName,
      });

      const message = `profile_client_api_error`;

      scope.setContext(message, {
        details,
        error,
        errorAsString: error ? JSON.stringify(error) : 'no error found',
      });

      Sentry.captureMessage(message);
    });
    return;
  }

  Sentry.withScope(scope => {
    const message = `profile_client_error`;
    scope.setContext(message, {
      error: JSON.stringify(error),
    });

    scope.setTag('profile-client-error-message', error?.message);

    Sentry.captureException(message);
  });
};

/**
 * Records a custom Google Analytics event for profile interactions.
 * Used for tracking modal interactions, button clicks, and form submissions.
 *
 * @param {Object} options - Event configuration
 * @param {string} [options.event='profile_modal'] - GA event name
 * @param {string} [options.title='no title'] - Modal or action title
 * @param {string} [options.status='none'] - Action status (success, failure, etc.)
 * @param {string} [options.primaryButtonText='none'] - Text of primary button clicked
 *
 * @example
 * import { recordCustomProfileEvent } from '@@vap-svc/util/analytics';
 *
 * recordCustomProfileEvent({
 *   title: 'Edit mobile phone',
 *   status: 'opened',
 *   primaryButtonText: 'Update'
 * });
 */
const recordCustomProfileEvent = ({
  event = 'profile_modal',
  title = 'no title',
  status = 'none',
  primaryButtonText = 'none',
}) => {
  const payload = {
    event,
    'modal-title': title,
    'modal-status': status,
    'modal-primaryButtonText': primaryButtonText,
  };
  recordEvent(payload);
};

export {
  createApiEvent,
  captureError,
  ERROR_SOURCES,
  recordCustomProfileEvent,
};

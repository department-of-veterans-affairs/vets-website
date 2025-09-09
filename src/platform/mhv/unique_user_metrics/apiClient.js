import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/exports';
import * as Sentry from '@sentry/browser';

const apiBasePath = `${environment.API_URL}/my_health/v1`;

const headers = {
  'Content-Type': 'application/json',
};

/**
 * Fire-and-forget API client for logging unique user metrics.
 *
 * This function makes a POST request to the unique_user_metrics endpoint
 * and doesn't wait for or return the response. It only logs errors if
 * the request fails or if the API returns an error status.
 *
 * @param {string[]} eventNames - Array of event names to log
 * @returns {void} This is a fire-and-forget operation
 */
export const logUniqueUserMetrics = eventNames => {
  // Validate input
  if (!Array.isArray(eventNames) || eventNames.length === 0) {
    Sentry.captureMessage(
      'MHV Unique User Metrics - Invalid event names provided',
      'warning',
    );
    return;
  }

  // Validate event name constraints from OpenAPI spec
  const invalidEvents = eventNames.filter(
    name => typeof name !== 'string' || name.length === 0 || name.length > 50,
  );

  if (invalidEvents.length > 0) {
    Sentry.captureMessage(
      `MHV Unique User Metrics - Invalid event names: ${invalidEvents.join(
        ', ',
      )}`,
      'warning',
    );
    return;
  }

  // Make the fire-and-forget API call
  apiRequest(`${apiBasePath}/unique_user_metrics`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      // eslint-disable-next-line camelcase
      event_names: eventNames,
    }),
  })
    .then(response => {
      // Even though this is fire-and-forget, we should log if there are
      // any reported errors in the response for debugging purposes
      if (response && response.results) {
        const errorResults = response.results.filter(
          result => result.status !== 'created' && result.status !== 'exists',
        );

        if (errorResults.length > 0) {
          Sentry.captureMessage(
            `MHV Unique User Metrics - API returned errors for events: ${errorResults
              .map(r => r.event_name)
              .join(', ')}`,
            'warning',
          );
        }
      }
    })
    .catch(error => {
      // Log the error but don't throw it since this is fire-and-forget
      Sentry.captureException(error);
      Sentry.captureMessage(
        `MHV Unique User Metrics - API request failed: ${error.message}`,
        'error',
      );
    });
};

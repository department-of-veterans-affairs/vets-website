import environment from 'platform/utilities/environment';
import * as Sentry from '@sentry/browser';

const ERROR_SOURCES = Object.freeze({
  API: 'api',
  OTHER: 'other',
});

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

      const message = `profile_client_api_error-${eventName}`;
      scope.setContext(message, {
        details,
        error,
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

export { createApiEvent, captureError, ERROR_SOURCES };

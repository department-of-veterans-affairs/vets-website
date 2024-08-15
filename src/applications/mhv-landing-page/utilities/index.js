import * as Sentry from '@sentry/browser';

import environment from '@department-of-veterans-affairs/platform-utilities/environment';

const captureError = error => {
  Sentry.withScope(scope => {
    const message = `mhv_client_error`;
    scope.setContext(message, {
      error: JSON.stringify(error),
    });
    Sentry.captureMessage(message);
  });

  if (!environment.isProduction()) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
};

export { captureError };

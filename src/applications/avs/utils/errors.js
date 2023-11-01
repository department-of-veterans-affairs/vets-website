import * as Sentry from '@sentry/browser';

const captureError = error => {
  Sentry.withScope(scope => {
    const message = `avs_client_error`;
    scope.setContext(message, {
      error: JSON.stringify(error),
    });
    Sentry.captureMessage(message);
  });
};

export { captureError };

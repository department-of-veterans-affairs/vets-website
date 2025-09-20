import * as Sentry from '@sentry/browser';

export const captureError = (error: Error): void => {
  Sentry.withScope(scope => {
    const message = `avs_client_error`;
    scope.setContext(message, {
      error: JSON.stringify(error),
    });
    Sentry.captureMessage(message);
  });
};

import * as Sentry from '@sentry/browser';

export function captureError(err) {
  if (err instanceof Error) {
    Sentry.captureException(err);
  } else {
    Sentry.withScope(scope => {
      scope.setExtra('error', err);
      // the apiRequest helper returns the errors array, instead of an exception
      Sentry.captureMessage(`vaos_server_error: ${err?.[0]?.title}`);
    });
  }
}

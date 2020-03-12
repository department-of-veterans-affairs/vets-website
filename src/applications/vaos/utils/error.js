import * as Sentry from '@sentry/browser';
import { recordVaosError } from './events';

export function captureError(err) {
  if (err instanceof Error) {
    Sentry.captureException(err);
    recordVaosError(err.message);
  } else {
    Sentry.withScope(scope => {
      scope.setExtra('error', err);
      const message = `vaos_server_error${
        err?.[0]?.title ? `: ${err?.[0]?.title}` : ''
      }`;
      recordVaosError(message);
      // the apiRequest helper returns the errors array, instead of an exception
      Sentry.captureMessage(message);
    });
  }
}

import * as Sentry from '@sentry/browser';
import { recordVaosError } from './events';
import environment from 'platform/utilities/environment';

export function captureError(err, skipRecordEvent = false, customTitle) {
  let eventErrorKey;

  if (err instanceof Error) {
    Sentry.captureException(err);
    eventErrorKey = err.message;
  } else {
    Sentry.withScope(scope => {
      scope.setExtra('error', err);
      const errorTitle =
        customTitle || err?.errors?.[0]?.title || err?.issue?.[0]?.code || err;
      const message = `vaos_server_error${errorTitle ? `: ${errorTitle}` : ''}`;
      eventErrorKey = message;
      // the apiRequest helper returns the errors array, instead of an exception
      Sentry.captureMessage(message);
    });
  }

  if (!skipRecordEvent) {
    recordVaosError(eventErrorKey);
  }

  if (!environment.isProduction()) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
}

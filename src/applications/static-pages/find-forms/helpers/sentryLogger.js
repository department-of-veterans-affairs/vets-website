import * as Sentry from '@sentry/browser';

// HOF for reusable situations in Component.
export function sentryLogger(form, formNumber, downloadUrl, message) {
  return Sentry.withScope(scope => {
    scope.setExtra('form API response', form);
    scope.setExtra('form number', formNumber);
    scope.setExtra('download link (invalid)', downloadUrl);
    Sentry.captureMessage(message);
  });
}

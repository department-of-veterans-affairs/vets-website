import * as Sentry from '@sentry/browser';
import { apiRequest } from 'platform/utilities/api';
import recordEvent from 'platform/monitoring/record-event';
import environment from 'platform/utilities/environment';

const fetchNewCSRFToken = async () => {
  const message = 'No csrfToken when making fetchFacilities.';
  const url = '/v0/maintenance_windows';
  recordEvent({
    event: 'caregivers-10-10cg-fetch-csrf-token-empty',
  });

  Sentry.withScope(scope => {
    scope.setLevel(Sentry.Severity.Log);
    Sentry.captureMessage(`${message} Calling ${url} to generate new one.`);
  });

  return apiRequest(`${environment.API_URL}${url}`, { method: 'HEAD' })
    .then(() => {
      Sentry.withScope(scope => {
        scope.setLevel(Sentry.Severity.Log);
        Sentry.captureMessage(
          `${message} ${url} successfully called to generate token.`,
        );
      });
    })
    .catch(error => {
      Sentry.withScope(scope => {
        scope.setLevel(Sentry.Severity.Log);
        scope.setExtra('error', error);
        Sentry.captureMessage(
          `${message} ${url} failed when called to generate token.`,
        );
      });
    });
};

export const ensureValidCSRFToken = async () => {
  const csrfToken = localStorage.getItem('csrfToken');
  if (!csrfToken) {
    await fetchNewCSRFToken();
  } else {
    recordEvent({
      event: 'caregivers-10-10cg-fetch-csrf-token-present',
    });
  }
};

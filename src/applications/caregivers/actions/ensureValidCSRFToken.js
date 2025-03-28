import * as Sentry from '@sentry/browser';
import { apiRequest } from 'platform/utilities/api';
import recordEvent from 'platform/monitoring/record-event';
import { API_ENDPOINTS } from '../utils/constants';

const fetchNewCSRFToken = async methodName => {
  const message = `No csrfToken when making ${methodName} call.`;
  const url = API_ENDPOINTS.csrfCheck;
  recordEvent({
    event: 'caregivers-10-10cg-fetch-csrf-token-empty',
  });

  Sentry.withScope(scope => {
    scope.setLevel(Sentry.Severity.Log);
    Sentry.captureMessage(`${message} Calling ${url} to generate new one.`);
  });

  return apiRequest(url, { method: 'HEAD' })
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

export const ensureValidCSRFToken = async methodName => {
  const csrfToken = localStorage.getItem('csrfToken');
  if (!csrfToken) {
    await fetchNewCSRFToken(methodName);
  } else {
    recordEvent({
      event: 'caregivers-10-10cg-fetch-csrf-token-present',
    });
  }
};

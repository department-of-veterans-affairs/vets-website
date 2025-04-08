import * as Sentry from '@sentry/browser';
import { apiRequest } from 'platform/utilities/api';
import { API_ENDPOINTS } from '../constants';

const fetchNewCSRFToken = async methodName => {
  const message = `No csrfToken when making ${methodName} call.`;
  const url = API_ENDPOINTS.csrfCheck;

  try {
    await apiRequest(url, { method: 'HEAD' });
    Sentry.withScope(scope => {
      scope.setLevel(Sentry.Severity.Log);
      Sentry.captureMessage(
        `${message} ${url} successfully called to generate token.`,
      );
    });
  } catch (error) {
    Sentry.withScope(scope => {
      scope.setLevel(Sentry.Severity.Log);
      scope.setExtra('error', error);
      Sentry.captureMessage(
        `${message} ${url} failed when called to generate token.`,
      );
    });
  }
};

export const ensureValidCSRFToken = async methodName => {
  const csrfToken = localStorage.getItem('csrfToken');
  if (!csrfToken) await fetchNewCSRFToken(methodName);
};

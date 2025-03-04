import { apiRequest } from 'platform/utilities/api';
import recordEvent from 'platform/monitoring/record-event';
import environment from 'platform/utilities/environment';

const fetchNewCSRFToken = async () => {
  const url = '/v0/maintenance_windows';
  recordEvent({
    event: 'pensions-21p-527-fetch-csrf-token-empty',
  });

  return apiRequest(`${environment.API_URL}${url}`, { method: 'HEAD' })
    .then(() => {
      recordEvent({
        event: 'pensions-21p-527-fetch-csrf-token-success',
      });
    })
    .catch(() => {
      recordEvent({
        event: 'pensions-21p-527-fetch-csrf-token-failure',
      });
    });
};

export const ensureValidCSRFToken = async () => {
  const csrfToken = localStorage.getItem('csrfToken');
  if (!csrfToken) {
    await fetchNewCSRFToken();
  } else {
    recordEvent({
      event: 'pensions-21p-527-fetch-csrf-token-present',
    });
  }
};

export const handleInvalidCSRF = error => {
  const errorResponse = error?.errors?.[0];

  if (
    errorResponse?.status === '403' &&
    errorResponse?.detail === 'Invalid Authenticity Token'
  ) {
    localStorage.setItem('csrfToken', '');
  }
};

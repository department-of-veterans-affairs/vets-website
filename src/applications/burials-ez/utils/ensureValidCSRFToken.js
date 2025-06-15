import { apiRequest } from 'platform/utilities/api';
import recordEvent from 'platform/monitoring/record-event';
import environment from 'platform/utilities/environment';

const fetchNewCSRFToken = async () => {
  const url = '/v0/maintenance_windows';
  recordEvent({
    event: 'burials-21p-530-fetch-csrf-token-empty',
  });
  return apiRequest(`${environment.API_URL}${url}`, { method: 'HEAD' })
    .then(() => {
      recordEvent({
        event: 'burials-21p-530-fetch-csrf-token-success',
      });
    })
    .catch(() => {
      recordEvent({
        event: 'burials-21p-530-fetch-csrf-token-failure',
      });
    });
};

export const ensureValidCSRFToken = async () => {
  const csrfToken = localStorage.getItem('csrfToken');
  if (!csrfToken) {
    await fetchNewCSRFToken();
  } else {
    recordEvent({
      event: 'burials-21p-530-fetch-csrf-token-present',
    });
  }
};

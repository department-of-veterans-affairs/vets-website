import { apiRequest } from 'platform/utilities/api';
import recordEvent from 'platform/monitoring/record-event';
import environment from 'platform/utilities/environment';

const fetchNewCSRFToken = async () => {
  const url = '/v0/maintenance_windows';
  // TODO: Add new version of pensions-21p-527-fetch-csrf-token-empty.
  recordEvent({
    event: '',
  });

  return apiRequest(`${environment.API_URL}${url}`, { method: 'HEAD' })
    .then(() => {
      // TODO: Add new version of pensions-21p-527-fetch-csrf-token-success.
      recordEvent({
        event: '',
      });
    })
    .catch(() => {
      // TODO: Add new version of pensions-21p-527-fetch-csrf-token-failure.
      recordEvent({
        event: '',
      });
    });
};

export const ensureValidCSRFToken = async () => {
  const csrfToken = localStorage.getItem('csrfToken');
  if (!csrfToken) {
    await fetchNewCSRFToken();
  } else {
    // TODO: Add new version of pensions-21p-527-fetch-csrf-token-present.
    recordEvent({
      event: '',
    });
  }
};

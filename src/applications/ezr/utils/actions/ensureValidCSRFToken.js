import recordEvent from 'platform/monitoring/record-event';
import { apiRequest } from 'platform/utilities/api';
import { API_ENDPOINTS } from '../constants';

const fetchNewCSRFToken = async methodName => {
  try {
    await apiRequest(API_ENDPOINTS.csrfCheck, { method: 'HEAD' });
    recordEvent({ event: 'ezr-csrf-token-fetch--success', method: methodName });
  } catch (error) {
    recordEvent({ event: 'ezr-csrf-token-fetch--failure', method: methodName });
  }
};

export const ensureValidCSRFToken = async methodName => {
  const csrfToken = localStorage.getItem('csrfToken');
  if (!csrfToken) await fetchNewCSRFToken(methodName);
};

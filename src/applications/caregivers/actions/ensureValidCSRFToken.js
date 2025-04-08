import recordEvent from 'platform/monitoring/record-event';
import { apiRequest } from 'platform/utilities/api';
import { API_ENDPOINTS } from '../utils/constants';

const fetchNewCSRFToken = async () => {
  try {
    await apiRequest(API_ENDPOINTS.csrfCheck, { method: 'HEAD' });
    recordEvent({ event: 'caregivers-csrf-token-fetch--success' });
  } catch (error) {
    recordEvent({ event: 'caregivers-csrf-token-fetch--failure' });
  }
};

export const ensureValidCSRFToken = async () => {
  const csrfToken = localStorage.getItem('csrfToken');
  if (!csrfToken) await fetchNewCSRFToken();
};

import recordEvent from '@department-of-veterans-affairs/platform-monitoring/record-event';
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import { API_ENDPOINTS } from '../utils/constants';

const fetchNewCSRFToken = async methodName => {
  try {
    await apiRequest(API_ENDPOINTS.csrfCheck, { method: 'HEAD' });
    recordEvent({
      event: 'caregivers-csrf-token-fetch--success',
      method: methodName,
    });
  } catch (error) {
    recordEvent({
      event: 'caregivers-csrf-token-fetch--failure',
      method: methodName,
    });
  }
};

export const ensureValidCSRFToken = async methodName => {
  const csrfToken = localStorage.getItem('csrfToken');
  if (!csrfToken) await fetchNewCSRFToken(methodName);
};

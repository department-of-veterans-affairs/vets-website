import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';

const settings = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
};

export const acceptDeclinePOARequest = async (veteranId, action) => {
  try {
    const resource = `/poa_requests/${veteranId}/${action}`;
    const response = await apiRequest(resource, settings);

    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }

    return { status: 'success' };
  } catch (error) {
    const errorMessage = error.message || 'An unexpected error occurred.';
    return { status: 'error', error: errorMessage };
  }
};

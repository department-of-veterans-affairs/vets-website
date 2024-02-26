import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';

const apiBasePath = 'poa_requests';

const settings = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
};

export const declinePOARequest = async veteranId => {
  try {
    const resource = `${apiBasePath}/${veteranId}`;
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

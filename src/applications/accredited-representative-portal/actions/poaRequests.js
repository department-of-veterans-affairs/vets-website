import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';

const settings = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
};

const handlePOARequest = async (veteranId, action) => {
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

export const acceptPOARequest = veteranId =>
  handlePOARequest(veteranId, 'accept');
export const declinePOARequest = veteranId =>
  handlePOARequest(veteranId, 'decline');

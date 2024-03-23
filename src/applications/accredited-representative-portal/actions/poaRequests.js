import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';

const handlePOARequest = async (poaId, action) => {
  try {
    const resource = `/accredited_representative_portal/v0/power_of_attorney_requests/${poaId}/${action}`;
    return await apiRequest(resource, { method: 'POST' });
  } catch (error) {
    return error;
  }
};

export const acceptPOARequest = poaId => handlePOARequest(poaId, 'accept');
export const declinePOARequest = poaId => handlePOARequest(poaId, 'decline');

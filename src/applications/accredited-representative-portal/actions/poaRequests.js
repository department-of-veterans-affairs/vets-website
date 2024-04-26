import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';

const handlePOARequest = async (procId, action) => {
  try {
    const resource = `/accredited_representative_portal/v0/power_of_attorney_requests/${procId}/${action}`;
    return await apiRequest(resource, { method: 'POST' });
  } catch (error) {
    return error;
  }
};

export const getPOARequestsByCodes = async poaCodes => {
  try {
    const resource = `/accredited_representative_portal/v0/power_of_attorney_requests?poa_codes=${poaCodes}`;
    return await apiRequest(resource);
  } catch (error) {
    return error;
  }
};

export const acceptPOARequest = procId => handlePOARequest(procId, 'accept');
export const declinePOARequest = procId => handlePOARequest(procId, 'decline');

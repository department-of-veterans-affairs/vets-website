import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';

const handlePOARequest = async (procId, action) => {
  const resource = `/power_of_attorney_requests/${procId}/${action}`;
  return apiRequest(resource, {
    apiVersion: 'accredited_representative_portal/v0',
    method: 'POST',
  });
};

export const getPOARequestsByCodes = async poaCodes => {
  const resource = `/power_of_attorney_requests?poa_codes=${poaCodes}`;
  return apiRequest(resource, {
    apiVersion: 'accredited_representative_portal/v0',
  });
};

export const acceptPOARequest = procId => handlePOARequest(procId, 'accept');
export const declinePOARequest = procId => handlePOARequest(procId, 'decline');

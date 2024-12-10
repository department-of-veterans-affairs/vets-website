import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';

const handlePOARequest = async (procId, action) => {
  const resource = `/power_of_attorney_requests/${procId}/${action}`;
  return apiRequest(resource, {
    apiVersion: 'accredited_representative_portal/v0',
    method: 'POST',
  });
};

export const acceptPOARequest = procId => handlePOARequest(procId, 'accept');
export const declinePOARequest = procId => handlePOARequest(procId, 'decline');

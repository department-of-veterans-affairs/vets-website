import { apiRequest } from 'platform/utilities/api';

export const fetchSupplyData = () => {
  return apiRequest('/v0/in_progress_forms/mdot', {
    method: 'GET',
  }).then(response => {
    // Process the response data as needed
    return response.data;
  });
};

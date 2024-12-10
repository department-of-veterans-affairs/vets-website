import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import mockPOARequestsResponse from '../mocks/mockPOARequestsResponse.json';

export async function poaRequestLoader({ params }) {
  const { id } = params;

  try {
    const response = await apiRequest(`/power_of_attorney_request/${id}`, {
      apiVersion: 'accredited_representative_portal/v0',
    });
    return response.data;
  } catch (error) {
    // Return mock data if API fails (TODO: remove this before pilot and replace with commented throw below)
    // throwing the error will cause the app to show the error message configured in routes.jsx
    return mockPOARequestsResponse.data.find(r => r.id === Number(id))
      ?.attributes;
    // throw error;
  }
}

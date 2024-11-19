import { getPOARequestsByCodes } from '../api/poaRequests';
import mockPOARequestsResponse from '../mocks/mockPOARequestsResponse.json';

export const poaRequestsLoader = async () => {
  const poaCodes = ['POA1', 'POA2']; // Example POA codes

  try {
    const response = await getPOARequestsByCodes(poaCodes);
    return { poaRequests: response.data };
  } catch (error) {
    // Return mock data as fallback
    return { poaRequests: mockPOARequestsResponse.data };
  }
};

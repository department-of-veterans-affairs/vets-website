// Dependencies.
import appendQuery from 'append-query';
// Relative imports.
import STUBBED_RESPONSE from '../api/STUBBED_RESPONSE';
import { apiRequest } from '../../../platform/utilities/api';
import { normalizeResponse } from '../helpers';

export const fetchResultsApi = async (options = {}) => {
  // Derive options properties.
  const mockRequest = options?.mockRequest || false;
  const name = options?.name;
  const city = options?.city;
  const state = options?.state;

  // Construct the URL and stub the response.
  const RESULTS_URL = appendQuery('/gi/institutions/search', {
    category: 'school',
    name,
    city,
    state,
    // eslint-disable-next-line
    yellow_ribbon_scholarship: true,
  });
  let response = STUBBED_RESPONSE;

  // Make the request for the results and update `response` with its repsonse.
  if (!mockRequest) {
    response = await apiRequest(RESULTS_URL);
  }

  // Normalize the response from the API.
  const normalizedResponse = normalizeResponse(response);

  return normalizedResponse;
};

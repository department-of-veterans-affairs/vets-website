// Dependencies.
import appendQuery from 'append-query';
// Relative imports.
import { apiRequest } from '../../../platform/utilities/api';
import { normalizeResponse } from '../helpers';

export const fetchResultsApi = async (options = {}) => {
  // Derive options properties.
  const mockRequest = options?.mockRequest;
  const name = options?.name;
  const page = options?.page;
  const perPage = options?.perPage;
  const state = options?.state;

  // Construct the URL and stub the response.
  const RESULTS_URL = appendQuery('/gi/institutions/search', {
    category: 'school',
    name,
    page,
    perPage,
    state,
    // eslint-disable-next-line
    yellow_ribbon_scholarship: true,
  });

  // Make the request for the results and update `response` with its repsonse.
  let response = {};
  if (!mockRequest) {
    response = await apiRequest(RESULTS_URL);
  }

  // Normalize the response from the API.
  const normalizedResponse = normalizeResponse(response);

  return normalizedResponse;
};

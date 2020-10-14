// Node modules.
import appendQuery from 'append-query';
// Relative imports.
import { apiRequest } from 'platform/utilities/api';
import { createMockResults, normalizeResponse } from '../helpers';

export const fetchResultsApi = async options => {
  const { category, platform, mockRequest, page = 1, perPage = 10 } = options;

  // Construct the URL and stub the response.
  const RESULTS_URL = appendQuery(
    '/third-party-applications',
    {
      category,
      platform,
      page,
      perPage,
    },
    { removeNull: true },
  );

  // Make the request for the results and update `response` with its repsonse.
  let response = createMockResults(category, platform);
  if (!mockRequest) {
    response = await apiRequest(RESULTS_URL);
  }

  // Normalize the response from the API.
  return normalizeResponse(response);
};

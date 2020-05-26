/* eslint-disable camelcase */

// Node modules.
import appendQuery from 'append-query';
// Relative imports.
import { apiRequest } from 'platform/utilities/api';
import { createMockResults, normalizeResponse } from '../helpers';

export const fetchResultsApi = async (options = {}) => {
  // Derive options properties.
  const category = options?.category;
  const platform = options?.platform;
  const mockRequest = options?.mockRequest;
  const page = options?.page;
  const per_page = options?.perPage;

  // Construct the URL and stub the response.
  const RESULTS_URL = appendQuery(
    '/third-party-applications',
    {
      category,
      platform,
      page,
      per_page,
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

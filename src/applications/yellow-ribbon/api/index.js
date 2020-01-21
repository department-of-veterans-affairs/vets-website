// Dependencies.
import appendQuery from 'append-query';
// Relative imports.
import STUBBED_RESPONSE from '../api/STUBBED_RESPONSE';
import { apiRequest } from '../../../platform/utilities/api';
import { normalizeResults } from '../helpers';

export const fetchResultsApi = async (query, options = {}) => {
  // Derive options properties.
  const mockRequest = options?.mockRequest || false;

  let RESULTS_URL = '/gi/institutions/search';
  let response = STUBBED_RESPONSE;

  // Add the `query` query param if provided.
  if (query) {
    RESULTS_URL = appendQuery(RESULTS_URL, { term: query });
  }

  // Make the request for the results.
  if (!mockRequest) {
    response = await apiRequest(RESULTS_URL);
  }

  // Derive the results.
  const results = response?.data;

  // Normalize the data from the API.
  const normalizedResults = normalizeResults(results);

  return normalizedResults;
};

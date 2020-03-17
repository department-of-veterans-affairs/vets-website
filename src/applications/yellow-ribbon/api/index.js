/* eslint-disable camelcase */

// Dependencies.
import appendQuery from 'append-query';
// Relative imports.
import { apiRequest } from '../../../platform/utilities/api';
import { normalizeResponse } from '../helpers';

export const fetchResultsApi = async (options = {}) => {
  // Derive options properties.
  const city = options?.city;
  const country = options?.country;
  const mockRequest = options?.mockRequest;
  const page = options?.page;
  const per_page = options?.perPage;
  const school_name_in_yr_database = options?.name;
  const state = options?.state;

  // Construct the URL and stub the response.
  const RESULTS_URL = appendQuery(
    '/gi/yellow_ribbon_programs',
    {
      city,
      country,
      school_name_in_yr_database,
      page,
      per_page,
      state,
    },
    { removeNull: true },
  );

  // Make the request for the results and update `response` with its repsonse.
  let response = {};
  if (!mockRequest) {
    response = await apiRequest(RESULTS_URL);
  }

  // Normalize the response from the API.
  const normalizedResponse = normalizeResponse(response);

  return normalizedResponse;
};

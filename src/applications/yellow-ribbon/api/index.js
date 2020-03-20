/* eslint-disable camelcase */

// Dependencies.
import appendQuery from 'append-query';
// Relative imports.
import { apiRequest } from '../../../platform/utilities/api';
import { normalizeResponse } from '../helpers';

export const fetchResultsApi = async (options = {}) => {
  // Derive options properties.
  const city = options?.city;
  const contributionAmount = options?.contributionAmount;
  const country = options?.country;
  const mockRequest = options?.mockRequest;
  const numberOfStudents = options?.numberOfStudents;
  const page = options?.page;
  const per_page = options?.perPage;
  const school_name_in_yr_database = options?.name;
  const state = options?.state;

  // Construct the URL and stub the response.
  const RESULTS_URL = appendQuery(
    '/gi/yellow_ribbon_programs',
    {
      city,
      contributionAmount,
      country,
      numberOfStudents,
      page,
      per_page,
      school_name_in_yr_database,
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

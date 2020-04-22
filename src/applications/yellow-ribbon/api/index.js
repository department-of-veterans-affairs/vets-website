/* eslint-disable camelcase */

// Dependencies.
import appendQuery from 'append-query';
// Relative imports.
import { apiRequest } from '../../../platform/utilities/api';
import { normalizeResponse } from '../helpers';

export const fetchResultsApi = async (options = {}) => {
  // Derive options properties.
  const city = options?.city;
  const contribution_amount = options?.contributionAmount;
  const mockRequest = options?.mockRequest;
  const name = options?.name;
  const number_of_students = options?.numberOfStudents;
  const page = options?.page;
  const per_page = options?.perPage;
  const state = options?.state;

  // Construct the URL and stub the response.
  const RESULTS_URL = appendQuery(
    '/gi/yellow_ribbon_programs',
    {
      city,
      contribution_amount,
      name,
      number_of_students,
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

// Relative imports.
import environment from 'platform/utilities/environment';
import { createMockResults } from '../helpers';

const baseUrl = '/services/apps/v0/directory';

export const fetchResults = async () => {
  // const response = await fetch(`${environment.API_URL}${baseUrl}`).then(
  //   data => {
  //     return data.json();
  //   },
  // );

  // Make the request for the results and update `response` with its repsonse.
  return createMockResults();
};

export const fetchScopes = async category => {
  return fetch(`${environment.API_URL}${baseUrl}/scopes/${category}`).then(
    data => data.json(),
  );
};

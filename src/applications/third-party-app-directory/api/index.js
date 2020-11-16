// Relative imports.
import environment from 'platform/utilities/environment';

const baseUrl = '/services/apps/v0/directory';

export const fetchResults = async () => {
  return fetch(`${environment.API_URL}${baseUrl}`).then(data => {
    return data.json();
  });
};

export const fetchScopes = async category => {
  return fetch(`${environment.API_URL}${baseUrl}/scopes/${category}`).then(
    data => data.json(),
  );
};

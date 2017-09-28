import environment from '../../common/helpers/environment';
import merge from 'lodash/fp/merge';
import Raven from 'raven-js';

function isJson(response) {
  const contentType = response.headers.get('content-type');
  return contentType && contentType.indexOf('application/json') !== -1;
}

export function apiRequest(url, optionalSettings = {}, success, error) {
  const requestUrl = `${environment.API_URL}${url}`;

  const defaultSettings = {
    method: 'GET',
    headers: {
      Authorization: `Token token=${sessionStorage.userToken}`,
      'X-Key-Inflection': 'camel',
    }
  };

  const settings = merge(defaultSettings, optionalSettings);

  return fetch(requestUrl, settings)
    .catch(err => {
      Raven.captureMessage(`vets_client_error: ${err.message}`, {
        extra: {
          error: err
        }
      });

      return Promise.reject(err);
    })
    .then((response) => {
      if (!response.ok) {
        // Refresh to show login view when requests are unauthorized.
        if (response.status === 401) { return window.location.reload(); }
        return Promise.reject(response);
      } else if (isJson(response)) {
        return response.json();
      }
      return Promise.resolve(response);
    })
    .then(success, error);
}

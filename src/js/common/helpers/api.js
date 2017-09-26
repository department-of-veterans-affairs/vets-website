import merge from 'lodash/fp/merge';
import appendQuery from 'append-query';

import environment from './environment';

function isJson(response) {
  const contentType = response.headers.get('content-type');
  return contentType && contentType.indexOf('application/json') !== -1;
}

export function apiRequest(resource, optionalSettings = {}, success, error) {
  const baseUrl = `${environment.API_URL}/v0`;
  const url = resource[0] === '/'
    ? [baseUrl, resource].join('')
    : resource;

  const defaultSettings = {
    method: 'GET',
    headers: {
      Authorization: `Token token=${sessionStorage.userToken}`,
      'X-Key-Inflection': 'camel'
    }
  };

  const settings = merge(defaultSettings, optionalSettings);

  return fetch(url, settings)
    .then((response) => {
      const data = isJson(response)
        ? response.json()
        : Promise.resolve(response);

      if (!response.ok) {
        if (response.status === 401) {
          window.location.href = appendQuery(
            environment.BASE_URL,
            { next: window.location.pathname }
          );
        }

        return data.then(Promise.reject.bind(Promise));
      }

      return data;
    })
    .then(success)
    .catch(error);
}

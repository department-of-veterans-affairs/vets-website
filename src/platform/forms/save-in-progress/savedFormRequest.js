import { merge } from 'lodash';

import environment from '../../utilities/environment';
import { fetchAndUpdateSessionExpiration as fetch } from '../../utilities/api';

function isJson(response) {
  const contentType = response.headers.get('content-type');
  return contentType && contentType.indexOf('application/json') !== -1;
}

// TODO: Remove this and replace with apiRequest once olive leaf issue is resolved on back end.
export function savedFormRequest(
  resource,
  success,
  error,
  optionalSettings = {},
) {
  const baseUrl = `${environment.API_URL}/v0`;
  const url = resource[0] === '/' ? [baseUrl, resource].join('') : resource;

  const defaultSettings = {
    method: 'GET',
    credentials: 'include',
  };

  const settings = merge({}, defaultSettings, optionalSettings);
  return fetch(url, settings)
    .then(response => {
      const data = isJson(response)
        ? response.json()
        : Promise.resolve(response);

      if (!response.ok) {
        // Refresh to show login view when requests are unauthorized.
        if (response.status === 401) {
          return window.location.reload();
        }
        return data.then(Promise.reject.bind(Promise));
      }

      return data;
    })
    .then(success, error);
}

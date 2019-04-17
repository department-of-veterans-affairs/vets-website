import Raven from 'raven-js';

import { expireSession } from 'platform/user/profile/utilities';
import environment from '../environment';
import localStorage from '../storage/localStorage';

function isJson(response) {
  const contentType = response.headers.get('Content-Type');
  return contentType && contentType.includes('application/json');
}

/**
 *
 * @param {string} resource - The URL to fetch. If it starts with a leading "/"
 * it will be appended to the baseUrl. Otherwise it will be used as an absolute
 * URL.
 * @param {Object} [{}] optionalSettings - Custom settings you want to apply to
 * the fetch request. Will be mixed with, and potentially override, the
 * defaultSettings
 * @param {Function} success - Callback to execute after successfully resolving
 * the initial fetch request.
 * @param {Function} error - Callback to execute if the fetch fails to resolve.
 */
export function apiRequest(resource, optionalSettings = {}, success, error) {
  const baseUrl = `${environment.API_URL}/v0`;
  const url = resource[0] === '/' ? [baseUrl, resource].join('') : resource;

  const defaultSettings = {
    method: 'GET',
    credentials: 'include',
    headers: {
      'X-Key-Inflection': 'camel',
    },
  };

  const newHeaders = Object.assign(
    {},
    defaultSettings.headers,
    optionalSettings ? optionalSettings.headers : undefined,
  );

  const settings = Object.assign({}, defaultSettings, optionalSettings);
  settings.headers = newHeaders;

  return fetch(url, settings)
    .catch(err => {
      Raven.captureMessage(`vets_client_error: ${err.message}`, {
        extra: {
          error: err,
        },
      });

      return Promise.reject(err);
    })
    .then(response => {
      const data = isJson(response)
        ? response.json()
        : Promise.resolve(response);

      if (response.ok || response.status === 304) {
        const sessionExpiration = response.headers.get('X-Session-Expiration');
        if (sessionExpiration)
          localStorage.setItem('sessionExpiration', sessionExpiration);
        return data;
      }

      // The timeout modal should cover any session timeouts,
      // but in case it doesn't, the next response with unauthorized status
      // will invoke the same session expiration flow.
      if (response.status === 401) expireSession();

      return data.then(Promise.reject.bind(Promise));
    })
    .then(success)
    .catch(error);
}

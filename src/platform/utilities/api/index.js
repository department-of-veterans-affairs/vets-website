import Raven from 'raven-js';
import appendQuery from 'append-query';

import environment from '../environment';
import conditionalStorage from '../storage/conditionalStorage';

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

  if (conditionalStorage().getItem('userToken')) {
    defaultSettings.headers.Authorization = `Token token=${conditionalStorage().getItem(
      'userToken',
    )}`;
  }

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

      if (!response.ok) {
        const { pathname } = window.location;
        const shouldRedirectToLogin =
          response.status === 401 && !pathname.includes('auth/login/callback');

        if (shouldRedirectToLogin) {
          const loginUrl = appendQuery(environment.BASE_URL, {
            next: pathname,
          });
          window.location.href = loginUrl;
        }

        return data.then(Promise.reject.bind(Promise));
      }

      return data;
    })
    .then(success)
    .catch(error);
}

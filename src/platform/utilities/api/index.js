import * as Sentry from '@sentry/browser';
import merge from 'lodash/merge';
import retryFetch from 'fetch-retry';

import environment from '../environment';
import localStorage from '../storage/localStorage';
import {
  checkOrSetSessionExpiration,
  infoTokenExists,
  refresh,
} from '../oauth/utilities';
import { checkAndUpdateSSOeSession } from '../sso';

const isJson = response => {
  const contentType = response.headers.get('Content-Type');
  return contentType && contentType.includes('application/json');
};

const retryOn = async (attempt, error, response) => {
  if (error) return false;

  if (response.status === 403) {
    const errorResponse = await response.clone().json();

    if (
      errorResponse?.errors === 'Access token has expired' &&
      infoTokenExists() &&
      attempt < 1
    ) {
      await refresh({ type: sessionStorage.getItem('serviceName') });

      return true;
    }
    return false;
  }

  return false;
};

export function fetchAndUpdateSessionExpiration(url, settings) {
  // use regular fetch if stubbed by sinon or cypress
  if (fetch.isSinonProxy) {
    return fetch(url, settings);
  }

  const originalFetch = fetch;
  // Only replace with custom fetch if not stubbed for unit testing
  const _fetch = !environment.isProduction()
    ? retryFetch(originalFetch)
    : fetch;

  const mergedSettings = {
    ...settings,
    ...(!environment.isProduction() && {
      retryOn,
    }),
  };

  return _fetch(url, mergedSettings).then(response => {
    const apiURL = environment.API_URL;

    if (response.url.includes(apiURL)) {
      /**
       * Sets sessionExpiration
       * SAML - Response headers `X-Session-Expiration`
       * OAuth - Cookie set by response
       * */
      checkOrSetSessionExpiration(response);

      // SSOe session is independent of vets-api, and must be kept alive for cross-session continuity
      if (response.ok || response.status === 304) {
        checkAndUpdateSSOeSession();
      }
    }
    return response;
  });
}

/**
 *
 * @param {string} resource - The URL to fetch. If it starts with a leading "/"
 * it will be appended to the baseUrl. Otherwise it will be used as an absolute
 * URL.
 * @param {Object} [{}] optionalSettings - Custom settings you want to apply to
 * the fetch request. Will be mixed with, and potentially override, the
 * defaultSettings
 * @param {Function} **(DEPRECATED)** success - Callback to execute after successfully resolving
 * the initial fetch request.
 * @param {Function} **(DEPRECATED)** error - Callback to execute if the fetch fails to resolve.
 */
export function apiRequest(resource, optionalSettings, success, error) {
  const apiVersion = (optionalSettings && optionalSettings.apiVersion) || 'v0';
  const baseUrl = `${environment.API_URL}/${apiVersion}`;
  const url = resource[0] === '/' ? [baseUrl, resource].join('') : resource;
  const csrfTokenStored = localStorage.getItem('csrfToken');

  if (success) {
    // eslint-disable-next-line no-console
    console.warn(
      'the "success" callback has been deprecated, please use a promise chain instead',
    );
  }

  if (error) {
    // eslint-disable-next-line no-console
    console.warn(
      'the "error" callback has been deprecated, please use a promise chain instead',
    );
  }

  const defaultSettings = {
    method: 'GET',
    credentials: 'include',
    headers: {
      'X-Key-Inflection': 'camel',
      'Source-App-Name': window.appName,
      'X-CSRF-Token': csrfTokenStored,
    },
  };
  const settings = merge(defaultSettings, optionalSettings);

  return fetchAndUpdateSessionExpiration(url, settings)
    .catch(err => {
      Sentry.withScope(scope => {
        scope.setExtra('error', err);
        scope.setFingerprint(['{{default}}', scope._tags?.source]);
        Sentry.captureMessage(`vets_client_error: ${err.message}`);
      });

      return Promise.reject(err);
    })
    .then(response => {
      const data = isJson(response)
        ? response.json()
        : Promise.resolve(response);

      // Get CSRF Token from API header
      const csrfToken = response.headers.get('X-CSRF-Token');

      if (csrfToken && csrfToken !== csrfTokenStored) {
        localStorage.setItem('csrfToken', csrfToken);
      }

      if (response.ok || response.status === 304) {
        return data;
      }

      if (environment.isProduction()) {
        const { pathname } = window.location;

        const shouldRedirectToSessionExpired =
          response.status === 401 &&
          !pathname.includes('auth/login/callback') &&
          sessionStorage.getItem('shouldRedirectExpiredSession') === 'true';

        if (shouldRedirectToSessionExpired) {
          window.location = '/session-expired';
        }
      }

      return data.then(Promise.reject.bind(Promise));
    })
    .then(success)
    .catch(error);
}

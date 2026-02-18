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

export function handleSessionUpdates(response) {
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
}

export function fetchAndUpdateSessionExpiration(url, settings) {
  // use regular fetch if stubbed by sinon or cypress
  if (fetch.isSinonProxy) {
    return fetch(url, settings);
  }

  const originalFetch = fetch;
  const _fetch = retryFetch(originalFetch);

  const mergedSettings = {
    ...settings,
    ...(!window.Mocha && { retryOn }),
  };

  return _fetch(url, mergedSettings).then(response => {
    handleSessionUpdates(response);
    return response;
  });
}

/**
 *
 * @param {string} resource - The URL to fetch. If it starts with a leading "/"
 * it will be appended to the baseUrl. Otherwise, it will be used as an absolute
 * URL.
 * @param {Object} [{}] optionalSettings - Custom settings you want to apply to
 * the fetch request. These will be merged with, and potentially override, the
 * default settings.
 * @param {Function} **(DEPRECATED)** success - Callback to execute after successfully resolving
 * the initial fetch request. Prefer using a promise chain instead.
 * @param {Function} **(DEPRECATED)** error - Callback to execute if the fetch fails to resolve.
 * Prefer using a promise chain instead.
 * @param {Object} [env=environment] - **Environment configuration object** used to determine
 * whether the code is running in production or non-production mode. If no environment object is provided, the function defaults to using the
 * global `environment` object.
 */
export function apiRequest(
  resource,
  optionalSettings,
  success,
  error,
  env = environment,
) {
  const apiVersion = (optionalSettings && optionalSettings.apiVersion) || 'v0';
  const baseUrl = `${environment.API_URL}/${apiVersion}`;
  const url = resource[0] === '/' ? [baseUrl, resource].join('') : resource;
  const csrfTokenStored = localStorage.getItem('csrfToken');
  const isProd = env.isProduction();

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
      const csrfToken =
        response.headers.get('X-CSRF-Token') ||
        response.headers.get('X-Csrf-Token'); // Needed for review instances

      if (csrfToken && csrfToken !== csrfTokenStored) {
        localStorage.setItem('csrfToken', csrfToken);
      }

      if (response.ok || response.status === 304) {
        return data;
      }

      if (isProd) {
        const { pathname } = window.location;

        const shouldRedirectToSessionExpired =
          response.status === 401 &&
          !pathname.includes('auth/login/callback') &&
          sessionStorage.getItem('shouldRedirectExpiredSession') === 'true' &&
          !pathname.includes('/terms-of-use/declined');

        if (shouldRedirectToSessionExpired) {
          sessionStorage.removeItem('shouldRedirectExpiredSession');
          window.location = '/?next=loginModal&status=session_expired';
        }
      }

      return data.then(Promise.reject.bind(Promise));
    })
    .then(success)
    .catch(error);
}

import * as Sentry from '@sentry/browser';

import { checkOrSetSessionExpiration } from 'platform/user/authentication/utilities';
import environment from '../environment';
import localStorage from '../storage/localStorage';
import { checkAndUpdateSSOeSession } from '../sso';
import { infoTokenExists, refresh } from '../oauth';

export function fetchAndUpdateSessionExpiration({
  fetchOptions,
  shouldRefresh = false,
} = {}) {
  // Only replace with custom fetch if not stubbed for unit testing
  if (!fetch.isSinonProxy) {
    if (shouldRefresh) {
      refresh(checkOrSetSessionExpiration);
    }
    return fetch.apply(this, Object.values(fetchOptions)).then(response => {
      const apiURL = environment.API_URL;

      if (
        response.url.includes(apiURL) &&
        (response.ok || response.status === 304)
      ) {
        // Get session expiration from header (SAML) or cookie (OAuth)
        checkOrSetSessionExpiration(response);

        if (!infoTokenExists()) {
          // SSOe session is independent of vets-api, and must be kept alive for cross-session continuity
          checkAndUpdateSSOeSession();
        }
      }
      return response;
    });
  }

  return fetch(...fetchOptions);
}

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
 * @param {Function} **(DEPRECATED)** success - Callback to execute after successfully resolving
 * the initial fetch request.
 * @param {Function} **(DEPRECATED)** error - Callback to execute if the fetch fails to resolve.
 */
export function apiRequest(resource, optionalSettings = {}, success, error) {
  const { apiVersion = 'v0', shouldRefresh } = optionalSettings;
  const baseUrl = `${environment.API_URL}/${apiVersion}`;
  const url = resource[0] === '/' ? `${baseUrl}${resource}` : resource;
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

  const settings = {
    method: 'GET',
    credentials: 'include',
    ...optionalSettings,
    headers: {
      'X-Key-Inflection': 'camel',
      'Source-App-Name': window.appName,
      'X-CSRF-Token': csrfTokenStored,
      ...optionalSettings.headers,
    },
  };

  return fetchAndUpdateSessionExpiration({
    fetchOptions: { url, settings },
    shouldRefresh,
  })
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

      if (environment.isStaging() || environment.isProduction()) {
        const { pathname } = window.location;
        const is401WithGoodPath =
          response.status === 401 && !pathname.includes('auth/login/callback');

        // const shouldRefreshOAuth = is401WithGoodPath && infoTokenExists();

        // if (shouldRefreshOAuth) {
        //   refresh();
        // }

        const shouldRedirectToSAMLSessionExpired =
          is401WithGoodPath &&
          !infoTokenExists() &&
          sessionStorage.getItem('shouldRedirectExpiredSession') === 'true';

        if (shouldRedirectToSAMLSessionExpired) {
          window.location = '/session-expired';
        }
      }

      return data.then(Promise.reject.bind(Promise));
    })
    .then(success)
    .catch(error);
}

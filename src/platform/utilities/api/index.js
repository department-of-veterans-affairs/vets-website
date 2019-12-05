import * as Sentry from '@sentry/browser';

import environment from '../environment';
import ENVIRONMENTS from '../../../site/constants/environments';
import localStorage from '../storage/localStorage';

const SSOeEndpoint = () => {
  let environmentPrefix;
  switch (ENVIRONMENTS.BUILDTYPE) {
    case ENVIRONMENTS.VAGOVSTAGING:
      environmentPrefix = 'sqa.';
      break;
    case ENVIRONMENTS.VAGOVDEV:
      environmentPrefix = 'int.';
      break;
    default:
      environmentPrefix = '';
  }

  return `${environmentPrefix}eauth.va.gov/favicon.ico`;
};

function refreshSSOeSession() {
  fetch(SSOeEndpoint(), {
    method: 'GET',
    credentials: 'include',
  })
    .then(() => {})
    .catch(err => {
      Sentry.withScope(scope => {
        scope.setExtra('error', err);
        Sentry.captureMessage(`SSOe error: ${err.message}`);
      });
    });
}

export function fetchAndUpdateSessionExpiration(...args) {
  // Only replace with custom fetch if not stubbed for unit testing
  if (fetch.displayName !== 'stub') {
    return fetch.apply(this, args).then(response => {
      const apiURL = environment.API_URL;

      if (
        response.url.includes(apiURL) &&
        (response.ok || response.status === 304)
      ) {
        // Get session expiration from header
        const sessionExpiration = response.headers.get('X-Session-Expiration');
        if (sessionExpiration) {
          localStorage.setItem('sessionExpiration', sessionExpiration);
        }
        // SSOe session is independent of vets-api, and must be kept alive for continuity
        refreshSSOeSession();
      }
      return response;
    });
  }

  return fetch(...args);
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
  const baseUrl = `${environment.API_URL}/v0`;
  const url = resource[0] === '/' ? [baseUrl, resource].join('') : resource;

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
    },
  };

  const newHeaders = Object.assign(
    {},
    defaultSettings.headers,
    optionalSettings ? optionalSettings.headers : undefined,
  );

  const settings = Object.assign({}, defaultSettings, optionalSettings);
  settings.headers = newHeaders;

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

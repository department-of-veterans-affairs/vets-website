import * as Sentry from '@sentry/browser';
import merge from 'lodash/merge';
import { fetchAndUpdateSessionExpiration } from 'platform/utilities/api';
import environment from 'platform/utilities/environment';
import localStorage from 'platform/utilities/storage/localStorage';
import manifest from '../manifest.json';
import { getSignInUrl } from './constants';
import { SORT_DEFAULTS } from './submissions';

// Set app name for request headers
window.appName = manifest.entryName;

const API_VERSION = 'accredited_representative_portal/v0';

/**
 * Enhanced API wrapper that preserves Response objects for error handling
 * while maintaining existing platform functionality where beneficial
 */
const wrapApiRequest = fn => {
  return async (...args) => {
    // Set up request options similarly to platform apiRequest
    const optionsFromCaller = args[fn.length] || {};
    const [resource, optionsFromFn = {}] = fn(...args.slice(0, fn.length));

    const csrfTokenStored = localStorage.getItem('csrfToken');

    const defaultSettings = {
      method: 'GET',
      credentials: 'include',
      headers: {
        'X-Key-Inflection': 'camel',
        'Source-App-Name': window.appName,
        'X-CSRF-Token': csrfTokenStored,
        'Content-Type': 'application/json',
      },
    };

    const settings = merge(defaultSettings, optionsFromFn, optionsFromCaller);

    // Build URL like platform apiRequest
    const baseUrl = `${environment.API_URL}/${API_VERSION}`;
    const url = resource[0] === '/' ? [baseUrl, resource].join('') : resource;

    try {
      // Reuse session management from platform
      const response = await fetchAndUpdateSessionExpiration(url, settings);

      // Handle CSRF token updates
      const csrfToken = response.headers.get('X-CSRF-Token');
      if (csrfToken && csrfToken !== csrfTokenStored) {
        localStorage.setItem('csrfToken', csrfToken);
      }

      // For successful responses,return data
      if (response.ok || response.status === 304) {
        return response;
      }

      // For 401s, redirect to login
      if (
        response.status === 401 &&
        // Don't redirect to login for our app's root / landing page experience.
        // People are allowed to be unauthenticated there.
        // TODO: probably need a more sound & principled solution here.
        ![manifest.rootUrl, `${manifest.rootUrl}/`].includes(
          window.location.pathname,
        )
      ) {
        window.location = getSignInUrl({
          returnUrl: window.location.href,
        });
        return null;
      }

      // For errors, preserve the Response object
      throw response;
    } catch (err) {
      // Log network-like errors to Sentry
      if (!(err instanceof Response)) {
        Sentry.withScope(scope => {
          scope.setExtra('error', err);
          scope.setFingerprint(['{{default}}', scope._tags?.source]);
          Sentry.captureMessage(`vets_client_error: ${err.message}`);
        });
      }
      throw err;
    }
  };
};

const api = {
  getPOARequests: wrapApiRequest(query => {
    let size;
    let number;
    let status;
    let sort;
    if (query.status) {
      status = `status=${query.status}`;
    }
    if (query.size) {
      size = `&page[size]=${query.size}`;
    }
    if (query.number) {
      number = `&page[number]=${query.number}`;
    }
    if (query.sort) {
      sort = `&sort[by]=${query.sort}&sort[order]=${query.sortBy}`;
    }
    return [`/power_of_attorney_requests?${status}${size}${number}${sort}`];
  }),
  getSubmissions: wrapApiRequest(query => {
    const size = query.size
      ? `page[size]=${query.size}`
      : `page[size]=${SORT_DEFAULTS.SIZE}`;
    const number = query.number
      ? `&page[number]=${query.number}`
      : `&page[number]=${SORT_DEFAULTS.NUMBER}`;
    const sort = query.sort
      ? `&sort[by]=${query.sort}&sort[order]=${query.sortBy}`
      : `&sort[by]=${SORT_DEFAULTS.SORT_BY}&sort[order]=${
          SORT_DEFAULTS.SORT_ORDER
        }`;
    return [`/submissions?${size}${number}${sort}`];
  }),
  claimantSearch: wrapApiRequest(data => {
    return [
      `/claimant/search`,
      {
        body: JSON.stringify({ ...data }),
        method: 'POST',
      },
    ];
  }),

  getPOARequest: wrapApiRequest(id => {
    return [`/power_of_attorney_requests/${id}`];
  }),

  getUser: wrapApiRequest(() => {
    return ['/user'];
  }),

  createPOARequestDecision: wrapApiRequest((id, decision) => {
    return [
      `/power_of_attorney_requests/${id}/decision`,
      {
        body: JSON.stringify({ decision }),
        method: 'POST',
      },
    ];
  }),
};

export default api;

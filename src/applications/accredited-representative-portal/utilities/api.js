import * as Sentry from '@sentry/browser';
import merge from 'lodash/merge';
import { fetchAndUpdateSessionExpiration } from 'platform/utilities/api';
import environment from 'platform/utilities/environment';
import localStorage from 'platform/utilities/storage/localStorage';
import manifest from '../manifest.json';
import { getSignInUrl, SORT_DEFAULTS } from './constants';
import { paramUpdate } from './helpers';

// Set app name for request headers
window.appName = manifest.entryName;

const API_VERSION = 'accredited_representative_portal/v0';
const doNotRedirectUrl = [
  manifest.rootUrl,
  `${manifest.rootUrl}/`,
  `${manifest.rootUrl}/help`,
  `${manifest.rootUrl}/sign-in`,
  `${manifest.rootUrl}/auth/login/callback`,
];
// 403 redirect handler
const redirectToUnauthorizedAndReturn = () => {
  const inAppPath = window.location.pathname.startsWith(manifest.rootUrl);
  if (inAppPath) {
    window.location.replace(`${manifest.rootUrl}/dashboard?unauthorized`);
    // Keep loaders pending until navigation completes to avoid UI flash
    return new Promise(() => {});
  }
  return null;
};

/**
 * Enhanced API wrapper that preserves Response objects for error handling
 * while maintaining existing platform functionality where beneficial
 */
const wrapApiRequest = fn => {
  return async (...args) => {
    // Set up request options similarly to platform apiRequest
    const optionsFromCaller = args[fn.length] || {};
    const [resource, optionsFromFn = {}] = fn(...args.slice(0, fn.length));

    const skip403Redirect =
      optionsFromCaller.skip403Redirect || optionsFromFn.skip403Redirect;

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
        !doNotRedirectUrl.includes(window.location.pathname)
      ) {
        window.location = getSignInUrl({
          returnUrl: window.location.href,
        });
        return null;
      }

      // For 403s, allow opt-out of redirect for special cases
      if (response.status === 403) {
        if (skip403Redirect) {
          throw response;
        }
        const redirected = redirectToUnauthorizedAndReturn();
        if (redirected) return redirected;
        throw response;
      }

      // For errors, preserve the Response object
      throw response;
    } catch (err) {
      // Mirror 403 handling when fetch throws a Response
      if (err instanceof Response && err.status === 403) {
        if (skip403Redirect) {
          throw err;
        }
        const redirected = redirectToUnauthorizedAndReturn();
        if (redirected) return redirected;
      }
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
const paginationDefaults = `page[size]=${SORT_DEFAULTS.SIZE}&page[number]=${
  SORT_DEFAULTS.NUMBER
}`;
const sortDefaults = `&sort[by]=${SORT_DEFAULTS.SORT_BY}&sort[order]=${
  SORT_DEFAULTS.SORT_ORDER
}`;
const api = {
  // Lightweight authorization check used by Dashboard loader
  checkAuthorized: wrapApiRequest(() => {
    return ['/authorize_as_representative'];
  }),
  getPOARequests: wrapApiRequest(query => {
    const status = query.status ? `status=${query.status}` : '';
    const pagination = query.size
      ? `&page[size]=${query.size}&page[number]=${query.number}`
      : paginationDefaults;
    const sortParam = paramUpdate(query.sort, query.status);
    const sort = sortParam
      ? `&sort[by]=${sortParam.sortBy}&sort[order]=${sortParam.order}`
      : sortDefaults;
    const showAllRequests = query.selectedIndividual === 'you';
    const selectedIndividual = query.selectedIndividual
      ? `&as_selected_individual=${showAllRequests}`
      : `&as_selected_individual=${SORT_DEFAULTS.SELECTED_INDIVIDUAL}`;
    const params = `${status + pagination + sort + selectedIndividual}`;
    return [`/power_of_attorney_requests${params ? '?' : ''}${params}`];
  }),
  getSubmissions: wrapApiRequest(query => {
    const pagination = query.size
      ? `&page[size]=${query.size}&page[number]=${query.number}`
      : paginationDefaults;
    const subParam = paramUpdate(query.sort);
    const sort = subParam
      ? `&sort[by]=${subParam.sortBy}&sort[order]=${subParam.order}`
      : sortDefaults;
    return [`/claim_submissions?${pagination}${sort}`];
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

  getClaimantOverview: wrapApiRequest(id => {
    return [`/claimant/${id}`];
  }),

  getIntentToFile: wrapApiRequest(
    ({
      benefitType,
      veteranSsn,
      veteranDateOfBirth,
      veteranFullName,
      claimantSsn,
      claimantDateOfBirth,
      claimantFullName,
    }) => {
      const params = new URLSearchParams();

      if (benefitType) params.set('benefitType', benefitType);
      if (veteranSsn) params.set('veteranSsn', veteranSsn);
      if (veteranDateOfBirth)
        params.set('veteranDateOfBirth', veteranDateOfBirth);

      if (veteranFullName?.first)
        params.set('veteranFullName[first]', veteranFullName.first);
      if (veteranFullName?.last)
        params.set('veteranFullName[last]', veteranFullName.last);

      if (benefitType === 'survivor') {
        if (claimantSsn) params.set('claimantSsn', claimantSsn);
        if (claimantDateOfBirth)
          params.set('claimantDateOfBirth', claimantDateOfBirth);
        if (claimantFullName?.first)
          params.set('claimantFullName[first]', claimantFullName.first);
        if (claimantFullName?.last)
          params.set('claimantFullName[last]', claimantFullName.last);
      }

      return [`/intent_to_file?${params.toString()}`];
    },
  ),
};

export default api;

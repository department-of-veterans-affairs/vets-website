import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import {
  AUTH_PARAMS as USIP_QUERY_PARAMS,
  EXTERNAL_APPS as USIP_APPLICATIONS,
} from 'platform/user/authentication/constants';

import { externalApplicationsConfig } from 'platform/user/authentication/usip-config';

import {
  API_SIGN_IN_SERVICE_URL as SIS_API_URL,
  OAUTH_KEYS as SIS_QUERY_PARAM_KEYS,
} from '~/platform/utilities/oauth/constants';

const ARP_SIGN_IN_URL = '/representative/sign-in';
const USIP_BASE_URL = environment.BASE_URL;

export const getSignInUrl = ({ returnUrl } = {}) => {
  const signInPath = ARP_SIGN_IN_URL;
  const url = new URL(signInPath, USIP_BASE_URL);
  url.searchParams.set(USIP_QUERY_PARAMS.application, USIP_APPLICATIONS.ARP);
  url.searchParams.set(USIP_QUERY_PARAMS.OAuth, true);
  if (returnUrl) {
    url.searchParams.set(USIP_QUERY_PARAMS.to, returnUrl);
  }
  return url;
};

export const SIGN_OUT_URL = (() => {
  const url = new URL(SIS_API_URL({ endpoint: 'logout' }));
  url.searchParams.set(
    SIS_QUERY_PARAM_KEYS.CLIENT_ID,
    externalApplicationsConfig[USIP_APPLICATIONS.ARP].oAuthOptions.clientId,
  );

  return url;
})();

export const SEARCH_PARAMS = {
  STATUS: 'status',
  SORT: 'sort',
  SIZE: 'perPage',
  NUMBER: 'page',
  SELECTED_INDIVIDUAL: 'show',
};
export const SORT_BY = {
  CREATED: 'created_at',
  RESOLVED: 'resolved_at',
  OLDEST: 'oldest',
  NEWEST: 'newest',
};

export const STATUSES = {
  PENDING: 'pending',
  PROCESSED: 'processed',
};

export const PROCESSED_SORT_DEFAULTS = {
  SORT: 'newest',
  // default is 20 per page
  SIZE: '20',
  // default is page 1
  NUMBER: '1',
  SELECTED_INDIVIDUAL: 'all',
};

export const PENDING_SORT_DEFAULTS = {
  SORT: 'newest',
  // default is 20 per page
  SIZE: '20',
  // default is page 1
  NUMBER: '1',
  SELECTED_INDIVIDUAL: 'all',
};

export const SUBMISSION_DEFAULTS = {
  STATUS: null,
  SORT: 'newest',
  // default is 20 per page
  SIZE: '20',
  // default is page 1
  NUMBER: '1',
};

export const SORT_OPTIONS = {
  DESC_OPTION: 'Submitted date (newest)',
  ASC_OPTION: 'Submitted date (oldest)',
};

export const SORT_DEFAULTS = {
  SORT_BY: 'created_at',
  SORT_ORDER: 'desc',
  // default is 20 per page
  SIZE: 20,
  // default is page 1
  NUMBER: 1,
  SELECTED_INDIVIDUAL: 'all',
};

export const DETAILS_BC_LABEL = 'details breadcrumb';
export const SUBMISSIONS_BC_LABEL = 'submissions breadcrumb';
export const submissionsBC = [
  {
    href: '/representative',
    label: 'VA.gov/representative home',
  },
  {
    href: window.location.href,
    label: 'Submissions',
  },
];

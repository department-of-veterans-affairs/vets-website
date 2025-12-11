import * as SIS from './sis';
import * as USIP from './usip';

export const SIGN_IN_URL = (() => {
  const url = new URL(USIP.PATH, USIP.BASE_URL);
  url.searchParams.set(
    USIP.QUERY_PARAM_KEYS.application,
    USIP.APPLICATIONS.ARP.SLUG,
  );
  url.searchParams.set(USIP.QUERY_PARAM_KEYS.OAuth, true);
  return url;
})();

export const SIGN_OUT_URL = (() => {
  const url = new URL(SIS.API_URL({ endpoint: 'logout' }));
  url.searchParams.set(
    SIS.QUERY_PARAM_KEYS.CLIENT_ID,
    USIP.APPLICATIONS.ARP.CLIENT_ID,
  );
  return url;
})();

export const NAV_MOBILE_DROPDOWN = [
  {
    LABEL: 'Dashboard',
    URL: '/dashboard',
    TEST_ID: 'user-nav-profile-link',
  },
];

export const NAV_MENU_DROPDOWN = [
  {
    LABEL: 'Find Claimant',
    URL: '/find-claimant',
    ICON: 'search',
    TEST_ID: 'user-nav-claimant-search-link',
  },
  {
    LABEL: 'Representation Requests',
    URL: '/representation-requests',
    TEST_ID: 'user-nav-representation-requests-link',
  },
  {
    LABEL: 'Submissions',
    URL: '/submissions',
    TEST_ID: 'submissions-link',
  },
  {
    LABEL: 'Help',
    URL: '/help',
    TEST_ID: 'user-nav-help-link',
  },
];

export const ITF_PATH = '/submit-va-form-21-0966';

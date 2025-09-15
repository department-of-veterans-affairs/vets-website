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
    LINK: '/dashboard',
    TEST_ID: 'user-nav-profile-link',
  },
];

export const NAV_MENU_DROPDOWN = [
  {
    LABEL: 'Find Claimant',
    URL: '/claimant-search',
    ICON: 'search',
    FEATURE_FLAG_NAME: 'accredited_representative_portal_search',
    TEST_ID: 'user-nav-claimant-search-link',
  },
  {
    LABEL: 'Representation Requests',
    URL: '/poa-requests',
    TEST_ID: 'user-nav-poa-requests-link',
  },
  {
    LABEL: 'Submissions',
    URL: '/submissions',
    FEATURE_FLAG_NAME: 'accredited_representative_portal_submissions',
    TEST_ID: 'submissions-link',
  },
  {
    LABEL: 'Help',
    URL: '/get-help',
    TEST_ID: 'user-nav-profile-link',
  },
];

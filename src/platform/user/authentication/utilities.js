import appendQuery from 'append-query';

import recordEvent from '../../monitoring/record-event';
import { apiRequest } from '../../utilities/api';
import environment from '../../utilities/environment';

const SESSIONS_URI = `${environment.API_URL}/sessions`;
const sessionTypeUrl = type => `${SESSIONS_URI}/${type}/new`;

const MHV_URL = sessionTypeUrl('mhv');
const DSLOGON_URL = sessionTypeUrl('dslogon');
const IDME_URL = sessionTypeUrl('idme');
const MFA_URL = sessionTypeUrl('mfa');
const VERIFY_URL = sessionTypeUrl('verify');
const LOGOUT_URL = sessionTypeUrl('slo');

const loginUrl = policy => {
  switch (policy) {
    case 'mhv':
      return MHV_URL;
    case 'dslogon':
      return DSLOGON_URL;
    default:
      return IDME_URL;
  }
};

function redirect(redirectUrl, clickedEvent, openedEvent) {
  // Keep track of the URL to return to after auth operation.
  sessionStorage.setItem('authReturnUrl', window.location);

  recordEvent({ event: clickedEvent });

  return apiRequest(
    redirectUrl,
    null,
    ({ url }) => {
      if (url) {
        recordEvent({ event: openedEvent });
        window.location = url;
      }
    },
    () => {
      // TODO: Create a separate page or modal when failed to get the URL.
      window.location = `${environment.BASE_URL}/auth/login/callback`;
    },
  );
}

export function login(policy) {
  sessionStorage.removeItem('registrationPending');
  return redirect(loginUrl(policy), 'login-link-clicked', 'login-link-opened');
}

export function mfa() {
  return redirect(
    MFA_URL,
    'multifactor-link-clicked',
    'multifactor-link-opened',
  );
}

export function verify() {
  return redirect(VERIFY_URL, 'verify-link-clicked', 'verify-link-opened');
}

export function logout() {
  return redirect(LOGOUT_URL, 'logout-link-clicked', 'logout-link-opened');
}

export function signup() {
  sessionStorage.setItem('registrationPending', true);
  return redirect(
    appendQuery(IDME_URL, { signup: true }),
    'register-link-clicked',
    'register-link-opened',
  );
}

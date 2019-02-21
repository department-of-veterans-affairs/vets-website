import appendQuery from 'append-query';
import Raven from 'raven-js';

import recordEvent from '../../monitoring/record-event';
import environment from '../../utilities/environment';

export const authnSettings = {
  RETURN_URL: 'authReturnUrl',
  REGISTRATION_PENDING: 'registrationPending',
  PENDING_LOGIN_TYPE: 'pendingLoginType',
};

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

export function setRavenLoginType(loginType) {
  Raven.setTagsContext({ loginType });
}

export function clearRavenLoginType() {
  Raven.setTagsContext({ loginType: undefined });
}

function redirect(redirectUrl, clickedEvent) {
  // Keep track of the URL to return to after auth operation.
  sessionStorage.setItem(authnSettings.RETURN_URL, window.location);
  recordEvent({ event: clickedEvent });
  window.location = redirectUrl;
}

export function login(policy) {
  sessionStorage.removeItem(authnSettings.REGISTRATION_PENDING);
  sessionStorage.setItem(authnSettings.PENDING_LOGIN_TYPE, policy);
  return redirect(loginUrl(policy), 'login-link-clicked-modal');
}

export function mfa() {
  return redirect(MFA_URL, 'multifactor-link-clicked');
}

export function verify() {
  return redirect(VERIFY_URL, 'verify-link-clicked');
}

export function logout() {
  clearRavenLoginType();
  return redirect(LOGOUT_URL, 'logout-link-clicked');
}

export function signup() {
  sessionStorage.setItem(authnSettings.REGISTRATION_PENDING, true);
  return redirect(
    appendQuery(IDME_URL, { signup: true }),
    'register-link-clicked',
  );
}

import appendQuery from 'append-query';
import Raven from 'raven-js';

import recordEvent from '../../monitoring/record-event';
import environment from '../../utilities/environment';

export const authnSettings = {
  RETURN_URL: 'authReturnUrl',
  PENDING_AUTH_ACTION: 'pendingAuthAction',
  PENDING_LOGIN_POLICY: 'pendingLoginPolicy',
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
  const context = Raven.getContext(); // Note: Do not mutate context directly.
  const tags = { ...context.tags };
  delete tags.loginType;
  Raven.setTagsContext(tags);
}

function redirect(redirectUrl, clickedEvent) {
  // Keep track of the URL to return to after auth operation.
  sessionStorage.setItem(authnSettings.RETURN_URL, window.location);
  recordEvent({ event: clickedEvent });
  window.location = redirectUrl;
}

export function login(policy) {
  sessionStorage.setItem(authnSettings.PENDING_AUTH_ACTION, 'login');
  sessionStorage.setItem(authnSettings.PENDING_LOGIN_POLICY, policy);
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
  sessionStorage.setItem(authnSettings.PENDING_AUTH_ACTION, 'register');
  return redirect(
    appendQuery(IDME_URL, { signup: true }),
    'register-link-clicked',
  );
}

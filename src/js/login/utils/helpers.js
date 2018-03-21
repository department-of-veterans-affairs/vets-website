import Raven from 'raven-js';
import appendQuery from 'append-query';

import { apiRequest } from '../../common/helpers/api';
import environment from '../../common/helpers/environment';

const SESSIONS_URI = `${environment.API_URL}/sessions`;
const redirectUrl = (type) => `${SESSIONS_URI}/${type}/new`;

const MHV_URL = redirectUrl('mhv');
const DSLOGON_URL = redirectUrl('dslogon');
const IDME_URL = redirectUrl('idme');
const MFA_URL = redirectUrl('mfa');
const VERIFY_URL = redirectUrl('verify');
const LOGOUT_URL = redirectUrl('slo');

const loginUrl = (policy) => {
  switch (policy) {
    case 'mhv': return MHV_URL;
    case 'dslogon': return DSLOGON_URL;
    default: return IDME_URL;
  }
};

function popup(popupUrl, clickedEvent, openedEvent) {
  window.dataLayer.push({ event: clickedEvent });
  const popupWindow = window.open('', 'vets.gov-popup', 'resizable=yes,scrollbars=1,top=50,left=500,width=500,height=750');
  if (popupWindow) {
    window.dataLayer.push({ event: openedEvent });
    popupWindow.focus();
    apiRequest(
      popupUrl,
      null,
      ({ url }) => { popupWindow.location.href = url; },
      () => { popupWindow.location.href = `${environment.BASE_URL}/auth/login/callback`; }
    );
  }

  Raven.captureMessage('Failed to open new window', {
    extra: { url: popupUrl }
  });
}

export function login(policy) {
  popup(loginUrl(policy), 'login-link-clicked', 'login-link-opened');
}

export function mfa() {
  popup(MFA_URL, 'multifactor-link-clicked', 'multifactor-link-opened');
}

export function verify() {
  popup(VERIFY_URL, 'verify-link-clicked', 'verify-link-opened');
}

export function logout() {
  popup(LOGOUT_URL, 'logout-link-clicked', 'logout-link-opened');
}

export function signup() {
  popup(appendQuery(IDME_URL, { signup: true }), 'register-link-clicked', 'register-link-opened');
}

import Raven from 'raven-js';
import appendQuery from 'append-query';

import recordEvent from '../../monitoring/record-event';
import { apiRequest } from '../../utilities/api';
import environment from '../../utilities/environment';
import localStorage from '../../utilities/storage/localStorage';

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

export function isFullScreenLoginEnabled() {
  return !!localStorage.getItem('enableFullScreenLogin');
}

function popup(popupUrl, clickedEvent, openedEvent) {
  recordEvent({ event: clickedEvent });
  const popupWindow = window.open(
    '',
    'vets.gov-popup',
    'resizable=yes,scrollbars=1,top=50,left=500,width=500,height=750',
  );
  if (popupWindow) {
    recordEvent({ event: openedEvent });
    popupWindow.focus();

    return apiRequest(
      popupUrl,
      null,
      ({ url }) => {
        if (url) popupWindow.location = url;
      },
      () => {
        popupWindow.location = `${environment.BASE_URL}/auth/login/callback`;
      },
    ).then(() => popupWindow);
  }

  Raven.captureMessage('Failed to open new window', {
    extra: { url: popupUrl },
  });

  return Promise.reject(new Error('Failed to open new window'));
}

function redirect(redirectUrl, clickedEvent, openedEvent) {
  if (!isFullScreenLoginEnabled()) {
    return popup(redirectUrl, clickedEvent, openedEvent);
  }

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
  return redirect(
    appendQuery(IDME_URL, { signup: true }),
    'register-link-clicked',
    'register-link-opened',
  );
}

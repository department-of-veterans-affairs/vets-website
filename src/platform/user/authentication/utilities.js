import appendQuery from 'append-query';
import * as Sentry from '@sentry/browser';

import recordEvent from '../../monitoring/record-event';
import environment from '../../utilities/environment';

export const authnSettings = {
  RETURN_URL: 'authReturnUrl',
};

function sessionTypeUrl(type, version = 'v0') {
  const SESSIONS_URI =
    version === 'v1'
      ? `${environment.API_URL}/v1/sessions`
      : `${environment.API_URL}/sessions`;

  return `${SESSIONS_URI}/${type}/new`;
}

const SIGNUP_URL = sessionTypeUrl('signup');
const MFA_URL = sessionTypeUrl('mfa');
const VERIFY_URL = sessionTypeUrl('verify');
const LOGOUT_URL = sessionTypeUrl('slo');

const loginUrl = (policy, version) => {
  switch (policy) {
    case 'mhv':
      return sessionTypeUrl('mhv', version);
    case 'dslogon':
      return sessionTypeUrl('dslogon', version);
    default:
      return sessionTypeUrl('idme', version);
  }
};

export function setSentryLoginType(loginType) {
  Sentry.setTag('loginType', loginType);
}

export function clearSentryLoginType() {
  Sentry.setTag('loginType', undefined);
}

function redirectWithGAClientId(redirectUrl) {
  try {
    // eslint-disable-next-line no-undef
    const trackers = ga.getAll();

    // Tracking IDs for Staging and Prod
    const vagovTrackingIds = ['UA-50123418-16', 'UA-50123418-17'];

    const tracker = trackers.find(t => {
      const trackingId = t.get('trackingId');
      return vagovTrackingIds.includes(trackingId);
    });

    const clientId = tracker && tracker.get('clientId');

    window.location = clientId
      ? // eslint-disable-next-line camelcase
        appendQuery(redirectUrl, { client_id: clientId })
      : redirectUrl;
  } catch (e) {
    window.location = redirectUrl;
  }
}

function redirect(redirectUrl, clickedEvent) {
  // Keep track of the URL to return to after auth operation.
  // If the user is coming via the standalone sign-in, redirect to the home page.
  const returnUrl =
    window.location.pathname === '/sign-in/'
      ? window.location.origin
      : window.location;
  sessionStorage.setItem(authnSettings.RETURN_URL, returnUrl);
  recordEvent({ event: clickedEvent });

  if (redirectUrl.includes('idme')) {
    redirectWithGAClientId(redirectUrl);
  } else {
    window.location = redirectUrl;
  }
}

export function login(policy, version = 'v0') {
  return redirect(loginUrl(policy, version), 'login-link-clicked-modal');
}

export function mfa() {
  return redirect(MFA_URL, 'multifactor-link-clicked');
}

export function verify() {
  return redirect(VERIFY_URL, 'verify-link-clicked');
}

export function logout() {
  clearSentryLoginType();
  return redirect(LOGOUT_URL, 'logout-link-clicked');
}

export function signup() {
  return redirect(SIGNUP_URL, 'register-link-clicked');
}

import appendQuery from 'append-query';
import * as Sentry from '@sentry/browser';
import URLSearchParams from 'url-search-params';

import recordEvent from '../../monitoring/record-event';
import environment from '../../utilities/environment';
import { eauthEnvironmentPrefixes } from '../../utilities/sso/constants';

export const authnSettings = {
  RETURN_URL: 'authReturnUrl',
};

export const ssoKeepAliveEndpoint = () => {
  const envPrefix = eauthEnvironmentPrefixes[environment.BUILDTYPE];
  return `https://${envPrefix}eauth.va.gov/keepalive`;
};

function sessionTypeUrl(type = '', version = 'v0', application = null) {
  const base =
    version === 'v1'
      ? `${environment.API_URL}/v1/sessions`
      : `${environment.API_URL}/sessions`;
  const params = new URLSearchParams();

  if (application) params.append('application', application);
  if (version === 'v1') params.append('force', 'true');

  return `${base}/${type}/new?${params.toString()}`;
}

const loginUrl = (policy, version, application) => {
  switch (policy) {
    case 'mhv':
      return sessionTypeUrl('mhv', version, application);
    case 'dslogon':
      return sessionTypeUrl('dslogon', version, application);
    default:
      return sessionTypeUrl('idme', version, application);
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

export function login(policy, version = 'v0', application = null) {
  return redirect(
    loginUrl(policy, version, application),
    'login-link-clicked-modal',
  );
}

export function autoLogin() {
  return redirect(sessionTypeUrl('idme', 'v1'), 'sso-automatic-login');
}

export function mfa(version = 'v0') {
  return redirect(sessionTypeUrl('mfa', version), 'multifactor-link-clicked');
}

export function verify(version = 'v0') {
  return redirect(sessionTypeUrl('verify', version), 'verify-link-clicked');
}

export function logout(version = 'v0') {
  clearSentryLoginType();
  return redirect(sessionTypeUrl('slo', version), 'logout-link-clicked');
}

export function autoLogout() {
  return redirect(sessionTypeUrl('slo', 'v1'), 'sso-automatic-logout');
}

export function signup(version = 'v0', application = null) {
  return redirect(
    sessionTypeUrl('signup', version, application),
    'register-link-clicked',
  );
}

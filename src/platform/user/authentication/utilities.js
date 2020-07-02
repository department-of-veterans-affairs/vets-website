import appendQuery from 'append-query';
import * as Sentry from '@sentry/browser';
import URLSearchParams from 'url-search-params';

import recordEvent from '../../monitoring/record-event';
import environment from '../../utilities/environment';
import { eauthEnvironmentPrefixes } from '../../utilities/sso/constants';
import { setLoginAttempted } from 'platform/utilities/sso/loginAttempted';

export const authnSettings = {
  RETURN_URL: 'authReturnUrl',
};

export const externalRedirects = {
  myvahealth: environment.isProduction()
    ? 'https://patientportal.myhealth.va.gov/'
    : 'https://ehrm-va-test.patientportal.us.healtheintent.com/',
};

export const ssoKeepAliveEndpoint = () => {
  const envPrefix = eauthEnvironmentPrefixes[environment.BUILDTYPE];
  return `https://${envPrefix}eauth.va.gov/keepalive`;
};

function sessionTypeUrl(type = '', version = 'v0', queryParams = {}) {
  const base =
    version === 'v1'
      ? `${environment.API_URL}/v1/sessions`
      : `${environment.API_URL}/sessions`;

  const searchParams = new URLSearchParams(queryParams);

  const queryString =
    searchParams.toString() === '' ? '' : `?${searchParams.toString()}`;

  return `${base}/${type}/new${queryString}`;
}

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

export function standaloneRedirect() {
  const searchParams = new URLSearchParams(window.location.search);
  const application = searchParams.get('application');
  const to = searchParams.get('to');
  let url = externalRedirects[application] || null;

  if (url && to) {
    url = url.replace(new RegExp('/$'), '');
    url += `/${to.replace(new RegExp('^/'), '').replace('\r\n', '')}`;
  }
  return url;
}

function redirect(redirectUrl, clickedEvent) {
  // Keep track of the URL to return to after auth operation.
  // If the user is coming via the standalone sign-in, redirect to the home page.
  const returnUrl =
    window.location.pathname === '/sign-in/'
      ? standaloneRedirect() || window.location.origin
      : window.location;
  sessionStorage.setItem(authnSettings.RETURN_URL, returnUrl);
  recordEvent({ event: clickedEvent });

  if (redirectUrl.includes('idme')) {
    redirectWithGAClientId(redirectUrl);
  } else {
    window.location = redirectUrl;
  }
}

export function login(
  policy,
  version = 'v0',
  queryParams = {},
  clickedEvent = 'login-link-clicked-modal',
) {
  const url = sessionTypeUrl(policy, version, queryParams);
  setLoginAttempted();
  return redirect(url, clickedEvent);
}

export function mfa(version = 'v0') {
  return redirect(sessionTypeUrl('mfa', version), 'multifactor-link-clicked');
}

export function verify(version = 'v0') {
  return redirect(sessionTypeUrl('verify', version), 'verify-link-clicked');
}

export function logout(version = 'v0', clickedEvent = 'logout-link-clicked') {
  clearSentryLoginType();
  return redirect(sessionTypeUrl('slo', version), clickedEvent);
}

export function signup(version = 'v0') {
  return redirect(sessionTypeUrl('signup', version), 'register-link-clicked');
}

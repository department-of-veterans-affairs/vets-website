import appendQuery from 'append-query';
import * as Sentry from '@sentry/browser';
import 'url-search-params-polyfill';

import recordEvent from '../../monitoring/record-event';
import environment from '../../utilities/environment';
import { eauthEnvironmentPrefixes } from '../../utilities/sso/constants';
import { setLoginAttempted } from 'platform/utilities/sso/loginAttempted';
import { AUTH_EVENTS } from './constants';

// NOTE: the login app typically has URLs that being with 'sign-in',
// however there is at least one CMS page, 'sign-in-faq', that we don't
// want to resolve with the login app
export const loginAppUrlRE = new RegExp('^/sign-in(/.*)?$');

export const authnSettings = {
  RETURN_URL: 'authReturnUrl',
  REDIRECT_EVENT: 'login-auth-redirect',
};

export const getQueryParams = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const application = searchParams.get('application');
  const to = searchParams.get('to');

  return { application, to };
};

const fixUrl = (url, path) => {
  const updatedUrl = url.endsWith('/') ? url.slice(0, -1) : url;
  return `${updatedUrl}${path}`.replace('\r\n', ''); // Prevent CRLF injection.
};

export const externalRedirects = {
  myvahealth: environment.isProduction()
    ? 'https://patientportal.myhealth.va.gov'
    : 'https://staging-patientportal.myhealth.va.gov',
  mhv: `https://${
    eauthEnvironmentPrefixes[environment.BUILDTYPE]
  }eauth.va.gov/mhv-portal-web/eauth`,
};

export const isExternalRedirect = () => {
  const { application } = getQueryParams();
  return (
    loginAppUrlRE.test(window.location.pathname) &&
    Object.keys(externalRedirects).includes(application)
  );
};

export const ssoKeepAliveEndpoint = () => {
  const envPrefix = eauthEnvironmentPrefixes[environment.BUILDTYPE];
  return `https://${envPrefix}eauth.va.gov/keepalive`;
};

export function sessionTypeUrl({
  type = '',
  version = 'v1',
  queryParams = {},
}) {
  const base = `${environment.API_URL}/${version}/sessions`;
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

const generatePath = (app, to) => {
  if (app === 'mhv') {
    return `?deeplinking=${to}`;
  }
  return to.startsWith('/') ? to : `/${to}`;
};

export function createExternalRedirectUrl({ base, returnUrl, application }) {
  return {
    mhv: `${base}?skip_dupe=mhv&redirect=${returnUrl}&postLogin=true`,
    myvahealth: `${base}`,
  }[application];
}

export function standaloneRedirect() {
  const { application, to } = getQueryParams();
  let url = externalRedirects[application] || null;

  if (url && to) {
    url = fixUrl(url, generatePath(application, to));
  }

  return url;
}

export function redirect(redirectUrl, clickedEvent) {
  const { application } = getQueryParams();
  const externalRedirect = isExternalRedirect();

  let rUrl = redirectUrl;
  // Keep track of the URL to return to after auth operation.
  // If the user is coming via the standalone sign-in, redirect to the home page.
  const returnUrl = externalRedirect
    ? standaloneRedirect()
    : window.location.origin;
  sessionStorage.setItem(authnSettings.RETURN_URL, returnUrl);
  recordEvent({ event: clickedEvent });

  // Generates the redirect for /sign-in page and tracks event
  if (
    externalRedirect &&
    [AUTH_EVENTS.SSO_LOGIN, AUTH_EVENTS.MODAL_LOGIN].includes(clickedEvent)
  ) {
    rUrl = createExternalRedirectUrl({
      base: redirectUrl,
      returnUrl,
      application,
    });
    recordEvent({
      event: `${authnSettings.REDIRECT_EVENT}-${application}-inbound`,
    });
  }

  if (redirectUrl.includes('idme')) {
    redirectWithGAClientId(rUrl);
  } else {
    window.location = rUrl;
  }
}

export function login({
  policy,
  version = 'v1',
  queryParams = {},
  clickedEvent = AUTH_EVENTS.MODAL_LOGIN,
}) {
  const url = sessionTypeUrl({ type: policy, version, queryParams });

  if (!isExternalRedirect()) {
    setLoginAttempted();
  }

  return redirect(url, clickedEvent);
}

export function mfa(version = 'v1') {
  return redirect(sessionTypeUrl({ type: 'mfa', version }), AUTH_EVENTS.MFA);
}

export function verify(version = 'v1') {
  return redirect(
    sessionTypeUrl({ type: 'verify', version }),
    AUTH_EVENTS.VERIFY,
  );
}

export function logout(
  version = 'v1',
  clickedEvent = AUTH_EVENTS.LOGOUT,
  queryParams = {},
) {
  clearSentryLoginType();
  return redirect(
    sessionTypeUrl({ type: 'slo', version, queryParams }),
    clickedEvent,
  );
}

export function signup({ version = 'v1', csp = 'idme' } = {}) {
  return redirect(
    sessionTypeUrl({
      type: `${csp}_signup`,
      version,
      ...(csp === 'idme' && { queryParams: { op: 'signup' } }),
    }),
    `${csp}-${AUTH_EVENTS.REGISTER}`,
  );
}

function getExternalRedirectOptions() {
  const { application, to } = getQueryParams();
  const returnUrl = isExternalRedirect()
    ? standaloneRedirect()
    : window.location.origin;

  return { application, to, returnUrl };
}

export const idmeSignupUrl = () => {
  const idmeOpts = { type: 'idme_signup', queryParams: { op: 'signup' } };
  const { returnUrl, application } = getExternalRedirectOptions();

  return isExternalRedirect()
    ? createExternalRedirectUrl({
        base: sessionTypeUrl(idmeOpts),
        returnUrl,
        application,
      })
    : sessionTypeUrl(idmeOpts);
};

export const loginGovSignupUrl = () => {
  const loginGovOpts = { type: 'logingov_signup' };
  const { returnUrl, application } = getExternalRedirectOptions();

  return isExternalRedirect()
    ? createExternalRedirectUrl({
        base: sessionTypeUrl(loginGovOpts),
        returnUrl,
        application,
      })
    : sessionTypeUrl(loginGovOpts);
};

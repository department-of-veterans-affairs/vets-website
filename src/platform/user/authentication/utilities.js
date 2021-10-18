import appendQuery from 'append-query';
import * as Sentry from '@sentry/browser';
import 'url-search-params-polyfill';

import recordEvent from '../../monitoring/record-event';
import environment from '../../utilities/environment';
import { eauthEnvironmentPrefixes } from '../../utilities/sso/constants';
import { setLoginAttempted } from 'platform/utilities/sso/loginAttempted';

// NOTE: the login app typically has URLs that being with 'sign-in',
// however there is at least one CMS page, 'sign-in-faq', that we don't
// want to resolve with the login app
export const loginAppUrlRE = new RegExp('^/sign-in(/.*)?$');

export const authnSettings = {
  RETURN_URL: 'authReturnUrl',
  REDIRECT_EVENT: 'auth-redirect',
};

const getQueryParams = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const application = searchParams.get('application');
  const to = searchParams.get('to');

  return { application, to };
};

export const externalRedirects = {
  myvahealth: environment.isProduction()
    ? 'https://patientportal.myhealth.va.gov/'
    : 'https://staging-patientportal.myhealth.va.gov/',
  mhv: `https://${
    eauthEnvironmentPrefixes[environment.BUILDTYPE]
  }eauth.va.gov/mhv-portal-web/eauth`,
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
  // force v1 regardless of version
  const base = `${environment.API_URL}/${version}/sessions`.replace(/v0/, 'v1');
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

export function standaloneRedirect() {
  const { application, to } = getQueryParams();
  let url = externalRedirects[application] || null;

  if (url && to) {
    const pathname = generatePath(application, to);
    url = url.endsWith('/') ? url.slice(0, -1) : url;
    url = `${url}${pathname}`.replace('\r\n', ''); // Prevent CRLF injection.
  }

  return url;
}

function generateLookup(returnUrl) {
  /*
    1. Grab the search params with the `to` query
    2. map thru the `to` to get the proper buildType
    3. generate a name from the object
  */
  const { application: app, to } = getQueryParams();
  const link = generatePath(app, to);

  const toRedirect = {
    // My VA Health (Cerner)
    '/pages/medications/current': 'prescriptions',
    '/pages/scheduling/upcoming': 'appointments',
    '/pages/messaging/inbox': 'secure_messaging',
    '/pages/health_record/results/labs': 'tests_and_labs',
    // My HealtheVet
    '?deeplinking=download_my_data': 'download_my_data',
    '?deeplinking=prescription_refill': 'prescription_refill',
    '?deeplinking=secure_messaging': 'secure_messaging',
    '?deeplinking=appointments': 'appointments',
    '?deeplinking=home': 'home',
    '?deeplinking=labs_and_tests': 'home',
  }[link];

  const externalRedirectLookup = {
    [`${externalRedirects.myvahealth}${link}`]: `myvahealth_${toRedirect}`,
    [`${externalRedirects.mhv}${link}`]: `mhv_${toRedirect}`,
  };

  return {
    redirectsTo: externalRedirectLookup[returnUrl],
    app,
  };
}

function redirect(redirectUrl, clickedEvent) {
  let rUrl = redirectUrl;
  // Keep track of the URL to return to after auth operation.
  // If the user is coming via the standalone sign-in, redirect to the home page.
  const returnUrl = loginAppUrlRE.test(window.location.pathname)
    ? standaloneRedirect() || window.location.origin
    : window.location;
  sessionStorage.setItem(authnSettings.RETURN_URL, returnUrl);
  recordEvent({ event: clickedEvent });

  /*
    TODO:
    1. Create a reverse lookup of MHV SSO Urls
    2. Create updated link to only check the rUrl
    3. RecordEvent for each app
  */
  if (loginAppUrlRE.test(window.location.pathname)) {
    const { redirectsTo, app } = generateLookup(returnUrl);
    rUrl = `${redirectUrl}?redirect=${redirectsTo}`;
    recordEvent({ event: `${authnSettings.REDIRECT_EVENT}-${app}-inbound` });
  }

  if (redirectUrl.includes('idme')) {
    redirectWithGAClientId(rUrl);
  } else {
    window.location = rUrl;
  }
}

export function login(
  policy,
  version = 'v1',
  queryParams = {},
  clickedEvent = 'login-link-clicked-modal',
) {
  const url = sessionTypeUrl({
    type: policy,
    version,
    queryParams,
  });
  setLoginAttempted();
  return redirect(url, clickedEvent);
}

export function mfa(version = 'v1') {
  return redirect(
    sessionTypeUrl({ type: 'mfa', version }),
    'multifactor-link-clicked',
  );
}

export function verify(version = 'v1') {
  return redirect(
    sessionTypeUrl({ type: 'verify', version }),
    'verify-link-clicked',
  );
}

export function logout(
  version = 'v1',
  clickedEvent = 'logout-link-clicked',
  queryParams = {},
) {
  clearSentryLoginType();
  return redirect(
    sessionTypeUrl({ type: 'slo', version, queryParams }),
    clickedEvent,
  );
}

export function signup(version = 'v1') {
  return redirect(
    sessionTypeUrl({ type: 'signup', version }),
    'register-link-clicked',
  );
}

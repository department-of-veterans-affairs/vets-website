import appendQuery from 'append-query';
import * as Sentry from '@sentry/browser';
import 'url-search-params-polyfill';

import { setLoginAttempted } from 'platform/utilities/sso/loginAttempted';
import { SKIP_DUPE_QUERY } from 'platform/utilities/sso/constants';
import {
  AUTH_EVENTS,
  AUTHN_SETTINGS,
  API_VERSION,
  EXTERNAL_APPS,
  EXTERNAL_REDIRECTS,
  VAGOV_TRACKING_IDS,
  CSP_IDS,
  POLICY_TYPES,
  SIGNUP_TYPES,
} from './constants';
import environment from '../../utilities/environment';
import recordEvent from '../../monitoring/record-event';

// NOTE: the login app typically has URLs that being with 'sign-in',
// however there is at least one CMS page, 'sign-in-faq', that we don't
// want to resolve with the login app
export const loginAppUrlRE = new RegExp('^/sign-in(/.*)?$');

function normalPageRedirect() {
  return loginAppUrlRE.test(window.location.pathname)
    ? window.location.origin
    : window.location.toString();
}

export const getQueryParams = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const application = searchParams.get('application');
  const to = searchParams.get('to');

  return { application, to };
};

const fixUrl = (url, path) => {
  if (!url) return null;
  const updatedUrl = url.endsWith('/') ? url.slice(0, -1) : url;
  return `${updatedUrl}${path}`.replace('\r\n', ''); // Prevent CRLF injection.
};

export const isExternalRedirect = () => {
  const { application } = getQueryParams();
  return (
    loginAppUrlRE.test(window.location.pathname) &&
    Object.keys(EXTERNAL_REDIRECTS).includes(application)
  );
};

export function sessionTypeUrl({
  type = '',
  queryParams = {},
  version = API_VERSION,
}) {
  const base = `${environment.API_URL}/${version}/sessions`;
  const searchParams = new URLSearchParams(queryParams);

  const { application } = getQueryParams();

  // Only require verification when all of the following are true:
  // 1. On the USiP (Unified Sign In Page)
  // 2. The outbound application is one of the mobile apps
  // 3. The generated link type is for signup, and login only
  const requireVerification =
    isExternalRedirect() &&
    [EXTERNAL_APPS.VA_OCC_MOBILE, EXTERNAL_APPS.VA_FLAGSHIP_MOBILE].includes(
      application,
    ) &&
    [...Object.values(SIGNUP_TYPES), ...Object.values(CSP_IDS)].includes(type)
      ? '_verified'
      : '';

  const queryString =
    searchParams.toString() === '' ? '' : `?${searchParams.toString()}`;

  return `${base}/${type}${requireVerification}/new${queryString}`;
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

    const tracker = trackers.find(t => {
      const trackingId = t.get('trackingId');
      return VAGOV_TRACKING_IDS.includes(trackingId);
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

export const generatePath = (app, to) => {
  function generateDefaultTo() {
    return app === EXTERNAL_APPS.EBENEFITS ? '/profilepostauth' : '';
  }

  function generateTo() {
    if (app === EXTERNAL_APPS.MHV) {
      return `?deeplinking=${to}`;
    }
    return to.startsWith('/') ? to : `/${to}`;
  }

  return !to ? generateDefaultTo() : generateTo();
};

export function createExternalRedirectUrl({ base, returnUrl, application }) {
  return {
    [EXTERNAL_APPS.MHV]: `${base}${
      SKIP_DUPE_QUERY.SINGLE_QUERY
    }&redirect=${returnUrl}&postLogin=true`,
    [EXTERNAL_APPS.MY_VA_HEALTH]: `${base}`,
    [EXTERNAL_APPS.EBENEFITS]: `${base}`,
    [EXTERNAL_APPS.VA_FLAGSHIP_MOBILE]: `${base}`,
    [EXTERNAL_APPS.VA_OCC_MOBILE]: `${base}`,
  }[application];
}

export function standaloneRedirect() {
  const { application, to } = getQueryParams();

  const externalRedirectUrl = EXTERNAL_REDIRECTS[application] ?? null;

  if (
    [EXTERNAL_APPS.VA_FLAGSHIP_MOBILE, EXTERNAL_APPS.VA_OCC_MOBILE].includes(
      application,
    ) &&
    externalRedirectUrl
  ) {
    return fixUrl(`${externalRedirectUrl}${window.location.search}`, '');
  }

  return fixUrl(externalRedirectUrl, generatePath(application, to));
}

export function redirect(redirectUrl, clickedEvent) {
  const { application } = getQueryParams();
  const externalRedirect = isExternalRedirect();

  let rUrl = redirectUrl;
  // Keep track of the URL to return to after auth operation.
  // If the user is coming via the standalone sign-in, redirect to the home page.
  const returnUrl = externalRedirect
    ? standaloneRedirect()
    : normalPageRedirect();

  sessionStorage.setItem(AUTHN_SETTINGS.RETURN_URL, returnUrl);
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
      event: `${AUTHN_SETTINGS.REDIRECT_EVENT}-${application}-inbound`,
    });
  }

  if (redirectUrl.includes(CSP_IDS.ID_ME)) {
    redirectWithGAClientId(rUrl);
  } else {
    window.location = rUrl;
  }
}

export function login({
  policy,
  version = API_VERSION,
  queryParams = {},
  clickedEvent = AUTH_EVENTS.MODAL_LOGIN,
}) {
  const url = sessionTypeUrl({ type: policy, version, queryParams });

  if (!isExternalRedirect()) {
    setLoginAttempted();
  }

  return redirect(url, clickedEvent);
}

export function mfa(version = API_VERSION) {
  return redirect(
    sessionTypeUrl({ type: POLICY_TYPES.MFA, version }),
    AUTH_EVENTS.MFA,
  );
}

export function verify(version = API_VERSION) {
  return redirect(
    sessionTypeUrl({ type: POLICY_TYPES.VERIFY, version }),
    AUTH_EVENTS.VERIFY,
  );
}

export function logout(
  version = API_VERSION,
  clickedEvent = AUTH_EVENTS.LOGOUT,
  queryParams = {},
) {
  clearSentryLoginType();
  return redirect(
    sessionTypeUrl({ type: POLICY_TYPES.SLO, version, queryParams }),
    clickedEvent,
  );
}

export function signup({ version = API_VERSION, csp = CSP_IDS.ID_ME } = {}) {
  return redirect(
    sessionTypeUrl({
      type: `${csp}_signup`,
      version,
      ...(csp === CSP_IDS.ID_ME && { queryParams: { op: 'signup' } }),
    }),
    `${csp}-${AUTH_EVENTS.REGISTER}`,
  );
}

function getExternalRedirectOptions() {
  const { application, to } = getQueryParams();
  const returnUrl = isExternalRedirect()
    ? standaloneRedirect()
    : normalPageRedirect();

  return { application, to, returnUrl };
}

export const signupUrl = type => {
  const signupType = SIGNUP_TYPES[type] || SIGNUP_TYPES.ID_ME;
  const queryParams =
    signupType === SIGNUP_TYPES.ID_ME
      ? {
          queryParams: { op: 'signup' },
        }
      : {};

  const opts = {
    type: signupType,
    ...queryParams,
  };

  const { returnUrl, application } = getExternalRedirectOptions();

  return isExternalRedirect()
    ? createExternalRedirectUrl({
        base: sessionTypeUrl(opts),
        returnUrl,
        application,
      })
    : sessionTypeUrl(opts);
};

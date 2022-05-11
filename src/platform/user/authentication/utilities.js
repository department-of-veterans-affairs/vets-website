import appendQuery from 'append-query';
import * as Sentry from '@sentry/browser';
import 'url-search-params-polyfill';

import { setLoginAttempted } from 'platform/utilities/sso/loginAttempted';
import {
  AUTH_EVENTS,
  AUTHN_SETTINGS,
  API_VERSION,
  EXTERNAL_APPS,
  EXTERNAL_REDIRECTS,
  GA_TRACKING_ID_KEY,
  VAGOV_TRACKING_IDS,
  CSP_IDS,
  POLICY_TYPES,
  SIGNUP_TYPES,
  API_SESSION_URL,
  GA_CLIENT_ID_KEY,
  EBenefitsDefaultPath,
  API_SIGN_IN_SERVICE_URL,
  AUTH_PARAMS,
  MOBILE_APPS,
  OAUTH_ENABLED_APPS,
  OAUTH_ENABLED_POLICIES,
} from './constants';
import recordEvent from '../../monitoring/record-event';

// NOTE: the login app typically has URLs that being with 'sign-in',
// however there is at least one CMS page, 'sign-in-faq', that we don't
// want to resolve with the login app
export const loginAppUrlRE = new RegExp('^/sign-in(/.*)?$');

export const getQueryParams = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const paramsObj = {};

  Object.keys(AUTH_PARAMS).forEach(paramKey => {
    const paramValue = searchParams.get(AUTH_PARAMS[paramKey]);
    if (paramValue) paramsObj[paramKey] = paramValue;
  });

  return paramsObj;
};

export const isExternalRedirect = () => {
  const { application } = getQueryParams();
  return (
    loginAppUrlRE.test(window.location.pathname) &&
    Object.keys(EXTERNAL_REDIRECTS).includes(application)
  );
};

export const fixUrl = (url, path = '') => {
  if (!url) return null;
  const updatedUrl = url.endsWith('/') ? url.slice(0, -1) : url;
  return `${updatedUrl}${path}`.replace('\r\n', ''); // Prevent CRLF injection.
};

export const generatePath = (app, to) => {
  function generateDefaultTo() {
    return app === EXTERNAL_APPS.EBENEFITS ? EBenefitsDefaultPath : '';
  }

  function generateTo() {
    if (app === EXTERNAL_APPS.MHV) {
      return `?deeplinking=${to}`;
    }
    return to.startsWith('/') ? to : `/${to}`;
  }

  return !to ? generateDefaultTo() : generateTo();
};

export const createExternalApplicationUrl = () => {
  const { application, to } = getQueryParams();

  const externalRedirectUrl = EXTERNAL_REDIRECTS[application] ?? null;

  if (
    [EXTERNAL_APPS.VA_FLAGSHIP_MOBILE, EXTERNAL_APPS.VA_OCC_MOBILE].includes(
      application,
    ) &&
    externalRedirectUrl
  ) {
    return fixUrl(`${externalRedirectUrl}${window.location.search}`);
  }

  return fixUrl(externalRedirectUrl, generatePath(application, to));
};

// Return URL is where a user will be forwarded post successful authentication
export const createAndStoreReturnUrl = () => {
  let returnUrl;
  if (loginAppUrlRE.test(window.location.pathname)) {
    if (isExternalRedirect()) {
      returnUrl = createExternalApplicationUrl();
    } else {
      // Return user to home page if internal authentication via USiP
      returnUrl = window.location.origin;
    }
  } else {
    // If we are not on the USiP, we should always return the user back to their current location
    returnUrl = window.location.toString();
  }

  sessionStorage.setItem(AUTHN_SETTINGS.RETURN_URL, returnUrl);
  return returnUrl;
};

export function sessionTypeUrl({
  type = '',
  queryParams = {},
  version = API_VERSION,
}) {
  if (!type) {
    return null;
  }

  // application is fetched from location, not the passed through queryParams arg
  const {
    application,
    OAuth,
    codeChallenge,
    codeChallengeMethod,
  } = getQueryParams();

  const externalRedirect = isExternalRedirect();
  const isMobileApplication = MOBILE_APPS.includes(application);
  const isSignup = Object.values(SIGNUP_TYPES).includes(type);
  const isLogin = Object.values(CSP_IDS).includes(type);
  const appendParams = {};

  // We should use OAuth when the following are true:
  // OAuth param is true
  // Application has OAuth enabled
  // The policy type has OAuth enabled
  const useOAuth =
    OAuth === 'true' &&
    OAUTH_ENABLED_APPS.includes(application) &&
    OAUTH_ENABLED_POLICIES.includes(type);

  // Only require verification when all of the following are true:
  // 1. On the USiP (Unified Sign In Page)
  // 2. The outbound application is one of the mobile apps
  // 3. The generated link type is for signup, and login only
  const requireVerification =
    externalRedirect && (isLogin || isSignup) && isMobileApplication
      ? '_verified'
      : '';

  // Append extra params for external MHV login attempts
  if (externalRedirect && isLogin && application === EXTERNAL_APPS.MHV) {
    // eslint-disable-next-line camelcase
    appendParams.skip_dupe = true;
    appendParams.redirect = createExternalApplicationUrl();
    appendParams.postLogin = true;
  }

  // Append extra params for external CERNER login attempts
  if (
    externalRedirect &&
    isLogin &&
    application === EXTERNAL_APPS.MY_VA_HEALTH
  ) {
    // eslint-disable-next-line camelcase
    appendParams.skip_dupe = true;
  }

  // Append extra params for mobile sign in service authentication
  if (useOAuth) {
    appendParams[AUTH_PARAMS.codeChallenge] = codeChallenge;
    appendParams[AUTH_PARAMS.codeChallengeMethod] = codeChallengeMethod;
  }

  return appendQuery(
    useOAuth
      ? API_SIGN_IN_SERVICE_URL({ type })
      : API_SESSION_URL({ version, type: `${type}${requireVerification}` }),
    { ...queryParams, ...appendParams, application },
  );
}

export function setSentryLoginType(loginType) {
  Sentry.setTag('loginType', loginType);
}

export function clearSentryLoginType() {
  Sentry.setTag('loginType', undefined);
}

export const redirectWithGAClientId = redirectUrl => {
  try {
    // eslint-disable-next-line no-undef
    const trackers = ga.getAll();

    const tracker = trackers.find(t => {
      const trackingId = t.get(GA_TRACKING_ID_KEY);
      return VAGOV_TRACKING_IDS.includes(trackingId);
    });

    const clientId = tracker && tracker.get(GA_CLIENT_ID_KEY);

    window.location = clientId
      ? // eslint-disable-next-line camelcase
        appendQuery(redirectUrl, { client_id: clientId })
      : redirectUrl;
  } catch (e) {
    window.location = redirectUrl;
  }
};

export function redirect(redirectUrl, clickedEvent) {
  const { application } = getQueryParams();
  const externalRedirect = isExternalRedirect();
  const existingReturnUrl = sessionStorage.getItem(AUTHN_SETTINGS.RETURN_URL);

  // Keep track of the URL to return to after auth operation.
  // If the user is coming via the standalone sign-in, redirect to the home page.
  // Do not overwite an existing returnUrl for VERIFY attempts
  if (!(existingReturnUrl && clickedEvent === AUTH_EVENTS.VERIFY)) {
    createAndStoreReturnUrl();
  }

  recordEvent({ event: clickedEvent });

  // Trigger USiP External Auth Event
  if (
    externalRedirect &&
    [AUTH_EVENTS.SSO_LOGIN, AUTH_EVENTS.MODAL_LOGIN].includes(clickedEvent)
  ) {
    recordEvent({
      event: `${AUTHN_SETTINGS.REDIRECT_EVENT}-${application}-inbound`,
    });
  }

  if (redirectUrl.includes(CSP_IDS.ID_ME)) {
    redirectWithGAClientId(redirectUrl);
  } else {
    window.location = redirectUrl;
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

export const signupUrl = type => {
  const signupType = SIGNUP_TYPES[type] ?? SIGNUP_TYPES[CSP_IDS.ID_ME];
  const queryParams =
    signupType === SIGNUP_TYPES[CSP_IDS.ID_ME]
      ? {
          queryParams: { op: 'signup' },
        }
      : {};

  const opts = {
    type: signupType,
    ...queryParams,
  };

  return sessionTypeUrl(opts);
};

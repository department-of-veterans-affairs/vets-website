import appendQuery from 'append-query';
import * as Sentry from '@sentry/browser';
import 'url-search-params-polyfill';
import environment from 'platform/utilities/environment';
import { createOAuthRequest } from 'platform/utilities/oauth/utilities';
import { setLoginAttempted } from 'platform/utilities/sso/loginAttempted';
import { externalApplicationsConfig } from './usip-config';
import {
  AUTH_EVENTS,
  AUTHN_SETTINGS,
  API_VERSION,
  EXTERNAL_APPS,
  EXTERNAL_REDIRECTS,
  GA,
  CSP_IDS,
  POLICY_TYPES,
  SIGNUP_TYPES,
  API_SESSION_URL,
  EBENEFITS_DEFAULT_PATH,
  AUTH_PARAMS,
  IDME_TYPES,
} from './constants';
import recordEvent from '../../monitoring/record-event';

// NOTE: the login app typically has URLs that being with 'sign-in',
// however there is at least one CMS page, 'sign-in-faq', that we don't
// want to resolve with the login app
export const loginAppUrlRE = new RegExp('^/sign-in(/.*)?$');

export const getQueryParams = () => {
  return Object.keys(AUTH_PARAMS).reduce((paramsObj, paramKey) => {
    const paramValue = new URLSearchParams(window.location.search).get(
      AUTH_PARAMS[paramKey],
    );
    return { ...paramsObj, ...(paramValue && { [paramKey]: paramValue }) };
  }, {});
};

export const reduceProviders = obj =>
  Object.entries(obj).reduce((acc, [key, value]) => {
    if (value) acc.push(key);
    return acc;
  }, []);

export const reduceAllowedProviders = (obj, type) => {
  if (!type || type === '') return reduceProviders(obj);

  if (
    Object.keys(obj).includes('registeredApps') &&
    type === 'registeredApps'
  ) {
    return reduceProviders(obj.registeredApps);
  }

  if (Object.keys(obj).includes('default') && type === 'default') {
    return reduceProviders(obj.default);
  }

  return reduceProviders(obj);
};

export const isExternalRedirect = () => {
  const { application } = getQueryParams();
  return (
    loginAppUrlRE.test(window.location.pathname) &&
    Object.keys(EXTERNAL_REDIRECTS).includes(application)
  );
};

export const sanitizeUrl = (url, path = '') => {
  if (!url) return null;
  const updatedUrl = url.endsWith('/') ? url.slice(0, -1) : url;
  const updatedPath = path ?? '';
  return `${updatedUrl}${updatedPath}`.replace('\r\n', ''); // Prevent CRLF injection.
};

export const sanitizePath = to => {
  if (!to) return '';
  return to.startsWith('/') ? to : `/${to}`;
};

export const sanitizeCernerParams = path => {
  if (!path) return '/?authenticated=true';
  const [updatedPath] = decodeURIComponent(path).split('?');
  return `${updatedPath}?authenticated=true`;
};

export const generateReturnURL = returnUrl => {
  return [
    `${environment.BASE_URL}/?next=loginModal`,
    `${environment.BASE_URL}`,
  ].includes(returnUrl)
    ? `${environment.BASE_URL}/my-va/`
    : returnUrl;
};

export const createExternalApplicationUrl = () => {
  const { application, to } = getQueryParams();
  if (!application) {
    return null;
  }
  const { externalRedirectUrl } = externalApplicationsConfig[application];
  let URL = '';

  switch (application) {
    case EXTERNAL_APPS.VA_FLAGSHIP_MOBILE:
      URL = externalRedirectUrl;
      break;
    case EXTERNAL_APPS.VA_OCC_MOBILE:
      URL = sanitizeUrl(`${externalRedirectUrl}${window.location.search}`);
      break;
    case EXTERNAL_APPS.EBENEFITS:
      URL = sanitizeUrl(
        `${externalRedirectUrl}`,
        `${!to ? EBENEFITS_DEFAULT_PATH : sanitizePath(to)}`,
      );
      break;
    case EXTERNAL_APPS.MHV:
      URL = sanitizeUrl(
        `${externalRedirectUrl}`,
        `${!to ? '' : `?deeplinking=${to}`}`,
      );
      break;
    case EXTERNAL_APPS.MY_VA_HEALTH:
      URL = sanitizeUrl(`${externalRedirectUrl}`, sanitizeCernerParams(to));
      break;
    default:
      break;
  }
  return URL;
};

export const getGAClientId = () => {
  try {
    // eslint-disable-next-line no-undef
    const trackers = ga.getAll();

    const tracker = trackers.find(t => {
      const trackingId = t.get(GA.trackingIdKey);
      return GA.trackingIds.includes(trackingId);
    });

    return (tracker && tracker.get(GA.clientIdKey)) ?? null;
  } catch (e) {
    return null;
  }
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
    if (sessionStorage.getItem(AUTHN_SETTINGS.RETURN_URL)) {
      return sessionStorage.getItem(AUTHN_SETTINGS.RETURN_URL);
    }
    // If we are not on the USiP, we should always return the user back to their current location
    returnUrl = window.location.toString();
  }

  sessionStorage.setItem(
    AUTHN_SETTINGS.RETURN_URL,
    returnUrl.replace('&oauth=true', ''),
  );
  return returnUrl;
};

export function sessionTypeUrl({
  type = '',
  queryParams = {},
  version = API_VERSION,
  allowVerification = false,
  useOauth = false,
  acr = null,
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
    clientId,
  } = getQueryParams();

  const externalRedirect = isExternalRedirect();
  const isSignup = Object.values(SIGNUP_TYPES).includes(type);
  const isLogin = Object.values(CSP_IDS).includes(type);
  const config =
    externalApplicationsConfig[application] ||
    externalApplicationsConfig.default;

  // We should use OAuth when the following are true:
  // OAuth param is 'true'
  // config.OAuthEnabled is true
  const useOAuth = useOauth || (config?.OAuthEnabled && OAuth === 'true');

  // Only require verification when all of the following are true:
  // 1. On the USiP (Unified Sign In Page)
  // 2. The outbound application is one of the mobile apps
  // 3. The generated link type is for signup, and login only
  const requireVerification =
    allowVerification ||
    (externalRedirect && (isLogin || isSignup) && config.requiresVerification)
      ? '_verified'
      : '';

  // Passes GA Client ID if it is an `ID.me` type
  const gaClientId = IDME_TYPES.includes(type) && getGAClientId();

  const appendParams =
    externalRedirect && isLogin
      ? {
          ...(config.queryParams.allowPostLogin && { postLogin: true }),
          ...(config.queryParams.allowRedirect && {
            redirect: createExternalApplicationUrl(),
          }),
        }
      : {};

  if (useOAuth && (isLogin || isSignup)) {
    return createOAuthRequest({
      acr,
      application,
      clientId,
      type,
      config,
      passedQueryParams: {
        codeChallenge,
        codeChallengeMethod,
        ...(gaClientId && { gaClientId }),
      },
      passedOptions: {
        isSignup,
      },
    });
  }
  return appendQuery(
    API_SESSION_URL({
      version,
      type: `${type}${requireVerification}`,
    }),
    {
      ...queryParams,
      ...appendParams,
      ...(gaClientId && {
        [GA.queryParams.default]: gaClientId,
      }),
      application,
    },
  );
}

export function setSentryLoginType(loginType) {
  Sentry.setTag('loginType', loginType);
}

export function clearSentryLoginType() {
  Sentry.setTag('loginType', undefined);
}

export function redirect(redirectUrl, clickedEvent, type = '') {
  const { application } = getQueryParams();
  const externalRedirect = isExternalRedirect();
  const existingReturnUrl = sessionStorage.getItem(AUTHN_SETTINGS.RETURN_URL);

  // Keep track of the URL to return to after auth operation.
  // If the user is coming via the standalone sign-in, redirect to the home page.
  // Do not overwite an existing returnUrl for VERIFY attempts
  if (
    !(existingReturnUrl && clickedEvent === AUTH_EVENTS.VERIFY) &&
    application !== CSP_IDS.MHV
  ) {
    createAndStoreReturnUrl();
  }

  recordEvent({ event: type ? `${clickedEvent}-${type}` : clickedEvent });

  // Trigger USiP External Auth Event
  if (
    externalRedirect &&
    [AUTH_EVENTS.SSO_LOGIN, AUTH_EVENTS.MODAL_LOGIN].includes(clickedEvent)
  ) {
    recordEvent({
      event: `${AUTHN_SETTINGS.REDIRECT_EVENT}-${application}-inbound`,
    });
  }

  window.location = redirectUrl;
}

export async function mockLogin({
  clickedEvent = AUTH_EVENTS.MOCK_LOGIN,
  type = '',
}) {
  if (!type) {
    throw new Error('Attempted to call mockLogin without a type');
  }
  const url = await createOAuthRequest({
    clientId: 'vamock',
    type,
  });
  if (!isExternalRedirect()) {
    setLoginAttempted();
  }
  return redirect(url, clickedEvent);
}

export async function login({
  policy,
  version = API_VERSION,
  queryParams = {},
  clickedEvent = AUTH_EVENTS.MODAL_LOGIN,
}) {
  const url = await sessionTypeUrl({ type: policy, version, queryParams });
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

export async function verify({
  policy = '',
  version = API_VERSION,
  clickedEvent = AUTH_EVENTS.VERIFY,
  isLink = false,
  useOAuth = false,
  acr = null,
}) {
  const type = SIGNUP_TYPES[policy];
  const url = await sessionTypeUrl({
    type,
    version,
    useOauth: useOAuth,
    ...(!useOAuth && { allowVerification: true }),
    acr,
  });

  return isLink ? url : redirect(url, `${type}-${clickedEvent}`);
}

export function logout({
  version = API_VERSION,
  clickedEvent = AUTH_EVENTS.LOGOUT,
  queryParams = {},
} = {}) {
  clearSentryLoginType();
  return redirect(
    sessionTypeUrl({ type: POLICY_TYPES.SLO, version, queryParams }),
    clickedEvent,
  );
}

export async function signupOrVerify({
  version = API_VERSION,
  policy = '',
  isSignup = true,
  isLink = false,
  useOAuth = false,
  allowVerification = true,
  config = 'default',
}) {
  const type = SIGNUP_TYPES[policy];
  const url = await sessionTypeUrl({
    type,
    version,
    ...(useOAuth && {
      // acr determined by signup or verify
      acr: isSignup
        ? externalApplicationsConfig[config].oAuthOptions.acrSignup[type]
        : externalApplicationsConfig[config].oAuthOptions.acrVerify[policy],
      useOauth: useOAuth,
    }),
    // just verify (<csp>_signup_verified)
    ...(!isSignup &&
      !useOAuth && {
        allowVerification,
      }),
    // just signup
    ...(isSignup &&
      !useOAuth &&
      policy === CSP_IDS.ID_ME && { queryParams: { op: 'signup' } }),
  });
  const eventBase = isSignup ? AUTH_EVENTS.REGISTER : AUTH_EVENTS.VERIFY;
  const eventAuthBroker = useOAuth ? 'sis' : 'iam';
  const eventIsVerified = allowVerification ? '-verified' : '';
  const event = `${policy}-${eventBase}${eventAuthBroker}${eventIsVerified}`;

  return isLink ? url : redirect(url, event);
}

export const logoutUrl = () => {
  return sessionTypeUrl({ type: POLICY_TYPES.SLO, version: API_VERSION });
};

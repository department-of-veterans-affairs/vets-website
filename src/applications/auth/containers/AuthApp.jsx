import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import appendQuery from 'append-query';

import * as Sentry from '@sentry/browser';

import recordEvent from 'platform/monitoring/record-event';
import { toggleLoginModal } from 'platform/site-wide/user-nav/actions';
import {
  AUTH_EVENTS,
  AUTHN_SETTINGS,
  EXTERNAL_APPS,
  EXTERNAL_REDIRECTS,
  FORCE_NEEDED,
} from 'platform/user/authentication/constants';
import {
  AUTH_LEVEL,
  AUTH_ERRORS,
  SENTRY_TAGS,
  getAuthError,
} from 'platform/user/authentication/errors';
import { setupProfileSession } from 'platform/user/profile/utilities';
import { apiRequest } from 'platform/utilities/api';
import { requestToken } from 'platform/utilities/oauth/utilities';
import { generateReturnURL } from 'platform/user/authentication/utilities';
import {
  OAUTH_ERRORS,
  OAUTH_ERROR_RESPONSES,
  OAUTH_EVENTS,
  OAUTH_KEYS,
} from 'platform/utilities/oauth/constants';
import RenderErrorUI from '../components/RenderErrorContainer';
import AuthMetrics from './AuthMetrics';

const REDIRECT_IGNORE_PATTERN = new RegExp(
  ['/auth/login/callback', '/session-expired'].join('|'),
);

const generateSentryAuthError = ({
  error = {},
  loginType,
  authErrorCode,
  requestId,
}) => {
  const { message, errorCode: detailedErrorCode } = getAuthError(authErrorCode);
  Sentry.withScope(scope => {
    scope.setExtra('error', error);
    scope.setExtra(SENTRY_TAGS.REQUEST_ID, requestId);
    scope.setTag(SENTRY_TAGS.LOGIN_TYPE, loginType);
    scope.setTag(SENTRY_TAGS.ERROR_CODE, detailedErrorCode);
    Sentry.captureMessage(`Auth Error: ${detailedErrorCode} - ${message}`);
  });
};
const AuthApp = ({ location }) => {
  const [hasError, setHasError] = useState(location.query.auth === 'fail');
  const [loginType] = useState(location.query.type || 'Login type not found');
  const [returnUrl] = useState(
    sessionStorage.getItem(AUTHN_SETTINGS.RETURN_URL) || '',
  );
  const [auth, setAuth] = useState(location.query.auth || 'fail');
  const [errorCode, setErrorCode] = useState(location.query.code || '');
  const [state, setState] = useState(location.query.state || '');
  const [requestId] = useState(
    location.query.request_id || 'No corresponding Request ID was found',
  );
  const dispatch = useDispatch();
  const handleAuthError = error => {
    const { errorCode: detailedErrorCode } = getAuthError(errorCode);
    generateSentryAuthError({
      error,
      loginType,
      authErrorCode: errorCode,
      requestId,
    });

    recordEvent({ event: AUTH_EVENTS.ERROR_USER_FETCH });

    setErrorCode(detailedErrorCode);
    setHasError(true);
  };

  const checkReturnUrl = passedUrl => {
    return (
      passedUrl.includes(EXTERNAL_REDIRECTS[EXTERNAL_APPS.MHV]) ||
      passedUrl.includes(EXTERNAL_REDIRECTS[EXTERNAL_APPS.MY_VA_HEALTH]) ||
      passedUrl.includes(EXTERNAL_REDIRECTS[EXTERNAL_APPS.EBENEFITS]) ||
      passedUrl.includes(EXTERNAL_REDIRECTS[EXTERNAL_APPS.VA_OCC_MOBILE]) ||
      passedUrl.includes(EXTERNAL_REDIRECTS[EXTERNAL_APPS.ARP])
    );
  };

  const redirect = () => {
    // remove from session storage
    sessionStorage.removeItem(AUTHN_SETTINGS.RETURN_URL);

    // redirect to my-va if necessary
    const updatedUrl = generateReturnURL(returnUrl);

    // check if usip client
    const postAuthUrl = checkReturnUrl(updatedUrl)
      ? updatedUrl
      : appendQuery(updatedUrl, 'postLogin=true');

    const redirectUrl =
      (!returnUrl.match(REDIRECT_IGNORE_PATTERN) && postAuthUrl) || '/';

    window.location.replace(redirectUrl);
  };

  const generateOAuthError = ({
    oauthErrorCode,
    event = OAUTH_EVENTS.ERROR_DEFAULT,
  }) => {
    recordEvent({ event });
    const { errorCode: detailedErrorCode } = getAuthError(oauthErrorCode);
    setErrorCode(detailedErrorCode);
    setAuth(AUTH_LEVEL.FAIL);
    setHasError(true);
    setState(state);
  };

  const handleTokenRequest = async ({
    code: authCode,
    state: authState,
    csp,
  }) => {
    // Verify the state matches in storage
    if (
      !localStorage.getItem(OAUTH_KEYS.STATE) ||
      localStorage.getItem(OAUTH_KEYS.STATE) !== authState
    ) {
      generateOAuthError({
        oauthErrorCode: AUTH_ERRORS.OAUTH_STATE_MISMATCH.errorCode,
        event: OAUTH_ERRORS.OAUTH_STATE_MISMATCH,
      });
    } else {
      // Matches - requestToken exchange
      try {
        await requestToken({ code: authCode, csp });
      } catch (error) {
        const { errors } = await error.json();
        const oauthErrorCode = OAUTH_ERROR_RESPONSES[errors];
        const event = OAUTH_EVENTS[errors] ?? OAUTH_EVENTS.ERROR_DEFAULT;
        generateOAuthError({ oauthErrorCode, event });
      }
    }
  };

  const handleAuthForceNeeded = () => {
    recordEvent({
      event: AUTH_EVENTS.ERROR_FORCE_NEEDED,
      eventCallback: redirect,
      eventTimeout: 2000,
    });
  };

  const handleAuthSuccess = ({
    response = {},
    skipToRedirect = false,
  } = {}) => {
    sessionStorage.setItem('shouldRedirectExpiredSession', true);
    const authMetrics = new AuthMetrics(
      loginType,
      response,
      requestId,
      errorCode,
    );
    authMetrics.run();
    if (!skipToRedirect) {
      setupProfileSession(authMetrics.userProfile);
    }
    redirect();
  };

  // Fetch the user to get the login policy and validate the session.

  const validateSession = async () => {
    if (errorCode && state) {
      await handleTokenRequest({ code: errorCode, state, csp: loginType });
    }

    if (auth === FORCE_NEEDED) {
      handleAuthForceNeeded();
    } else if (!hasError && checkReturnUrl(returnUrl)) {
      handleAuthSuccess({ skipToRedirect: true });
    } else {
      try {
        const response = await apiRequest('/user');
        handleAuthSuccess({ response });
      } catch (error) {
        handleAuthError(error);
      }
    }
  };

  useEffect(() => {
    if (hasError) {
      handleAuthError();
    } else {
      validateSession();
    }
  }, []);

  const openLoginModal = () => {
    dispatch(toggleLoginModal(true));
  };
  const renderErrorProps = {
    code: getAuthError(errorCode).errorCode,
    auth,
    requestId,
    recordEvent,
    openLoginModal,
  };

  return (
    <div className="row vads-u-padding-y--5">
      {hasError ? (
        <RenderErrorUI {...renderErrorProps} />
      ) : (
        <va-loading-indicator message="Signing in to VA.gov..." />
      )}
    </div>
  );
};
export default AuthApp;

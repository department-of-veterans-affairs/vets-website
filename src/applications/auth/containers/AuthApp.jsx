import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import appendQuery from 'append-query';

import recordEvent from 'platform/monitoring/record-event';
import { toggleLoginModal } from 'platform/site-wide/user-nav/actions';
import {
  AUTH_EVENTS,
  AUTHN_SETTINGS,
  FORCE_NEEDED,
} from 'platform/user/authentication/constants';
import { AUTH_LEVEL, getAuthError } from 'platform/user/authentication/errors';
import { setupProfileSession } from 'platform/user/profile/utilities';
import { apiRequest } from 'platform/utilities/api';

import { generateReturnURL } from 'platform/user/authentication/utilities';
import { OAUTH_EVENTS } from 'platform/utilities/oauth/constants';
import RenderErrorUI from '../components/RenderErrorContainer';
import AuthMetrics from './AuthMetrics';
import {
  checkReturnUrl,
  generateSentryAuthError,
  handleTokenRequest,
} from '../helpers';

const REDIRECT_IGNORE_PATTERN = new RegExp(
  ['/auth/login/callback', '/session-expired'].join('|'),
);

export default function AuthApp({ location }) {
  const [
    { auth, errorCode, returnUrl, loginType, state, requestId },
    setAuthState,
  ] = useState({
    auth: location?.query?.auth || 'fail',
    errorCode: location?.query?.code || '',
    loginType: location?.query?.type || 'Login type not found',
    requestId:
      location?.query?.request_id || 'No corresponding Request ID was found',
    returnUrl: sessionStorage.getItem(AUTHN_SETTINGS.RETURN_URL) ?? '',
    state: location?.query?.state || '',
  });
  const [hasError, setHasError] = useState(auth === 'fail');

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

    setAuthState(prevProps => ({
      ...prevProps,
      errorCode: detailedErrorCode,
    }));
    setHasError(true);
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
    setAuthState(prevProps => ({
      ...prevProps,
      errorCode: detailedErrorCode,
      auth: AUTH_LEVEL.FAIL,
    }));
    setHasError(true);
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
      await handleTokenRequest({
        code: errorCode,
        state,
        csp: loginType,
        generateOAuthError,
      });
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
        <va-loading-indicator
          message="Signing in to VA.gov..."
          data-testid="loading"
        />
      )}
    </div>
  );
}

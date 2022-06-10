import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import appendQuery from 'append-query';

import * as Sentry from '@sentry/browser';

import recordEvent from 'platform/monitoring/record-event';
import { toggleLoginModal } from 'platform/site-wide/user-nav/actions';
import {
  AUTHN_SETTINGS,
  EXTERNAL_APPS,
  EXTERNAL_REDIRECTS,
  CSP_IDS,
  AUTH_EVENTS,
} from 'platform/user/authentication/constants';
import {
  hasSession,
  setupProfileSession,
} from 'platform/user/profile/utilities';
import { apiRequest } from 'platform/utilities/api';
import { requestToken } from 'platform/utilities/oauth/utilities';
import RenderErrorUI from '../components/RenderErrorContainer';
import AuthMetrics from './AuthMetrics';

const REDIRECT_IGNORE_PATTERN = new RegExp(
  ['/auth/login/callback', '/session-expired'].join('|'),
);

const redirect = (userProfile = {}) => {
  const returnUrl = sessionStorage.getItem(AUTHN_SETTINGS.RETURN_URL) || '';

  const handleRedirect = () => {
    sessionStorage.removeItem(AUTHN_SETTINGS.RETURN_URL);

    const postAuthUrl = returnUrl
      ? appendQuery(returnUrl, 'postLogin=true')
      : returnUrl;

    const redirectUrl =
      (!returnUrl.match(REDIRECT_IGNORE_PATTERN) && postAuthUrl) || '/';

    window.location.replace(redirectUrl);
  };

  // Enforce LOA3 for external redirects to My VA Health
  if (
    returnUrl.includes(EXTERNAL_REDIRECTS[EXTERNAL_APPS.MY_VA_HEALTH]) &&
    !userProfile.verified
  ) {
    window.location.replace('/sign-in/verify');
    return;
  }

  if (
    returnUrl.includes(EXTERNAL_REDIRECTS[EXTERNAL_APPS.MHV]) ||
    returnUrl.includes(EXTERNAL_REDIRECTS[EXTERNAL_APPS.MY_VA_HEALTH])
  ) {
    const app = returnUrl.includes(EXTERNAL_REDIRECTS[EXTERNAL_APPS.MHV])
      ? CSP_IDS.MHV
      : EXTERNAL_APPS.MY_VA_HEALTH;

    recordEvent({
      event: `login-inbound-redirect-to-${app}`,
      eventCallback: handleRedirect,
      eventTimeout: 2000,
    });
    return;
  }

  handleRedirect();
};

const handleAuthSuccess = ({ payload, query }) => {
  sessionStorage.setItem('shouldRedirectExpiredSession', true);
  const { type } = query;

  const authMetrics = new AuthMetrics(type, payload);
  authMetrics.run();
  setupProfileSession(authMetrics.userProfile);
  redirect(authMetrics.userProfile);
};

export function AuthApp2({ location: { query }, openLoginModal }) {
  const [authAppOptions, setAuthAppOptions] = useState({
    hasError: query.auth === 'fail',
    loginType: query.type || '',
    returnUrl: sessionStorage.getItem(AUTHN_SETTINGS.RETURN_URL) || '',
    auth: query.auth || '',
    code: query.code || '',
    state: query.state || '',
  });

  const generateOAuthError = ({
    code,
    event = AUTH_EVENTS.OAUTH_ERROR_DEFAULT,
  }) => {
    recordEvent({ event });

    setAuthAppOptions(prevProps => ({
      ...prevProps,
      code,
      auth: 'fail',
      hasError: true,
    }));
  };

  const handleAuthForceNeeded = () => {
    // Handle redirect in the callback of the event data to ensure we process the even before navigation occurs
    recordEvent({
      event: AUTH_EVENTS.ERROR_FORCE_NEEDED,
      eventCallback: redirect,
      eventTimeout: 2000,
    });
  };

  const handleAuthError = useCallback(
    ({ error }) => {
      const { loginType } = authAppOptions;

      Sentry.withScope(scope => {
        scope.setExtra('error', error);
        scope.setTag('loginType', loginType);
        Sentry.captureMessage(`User fetch error: ${error.message}`);
      });

      recordEvent({ event: AUTH_EVENTS.ERROR_USER_FETCH });

      setAuthAppOptions(prevState => ({ ...prevState, hasError: true }));
    },
    [authAppOptions],
  );

  // Fetch the user to get the login policy and validate the session.
  const validateSession = useCallback(
    async () => {
      const { code, state, auth } = authAppOptions;
      if (code && state) {
        // Verify the state matches in localStorage
        if (
          !sessionStorage.getItem('state') ||
          sessionStorage.getItem('state') !== state
        ) {
          generateOAuthError({
            code: 201,
            event: AUTH_EVENTS.OAUTH_ERROR_STATE_MISMATCH,
          });
        } else {
          // Matches - requestToken exchange
          try {
            await requestToken({ code });
          } catch (error) {
            generateOAuthError({
              code: 202,
              event: AUTH_EVENTS.OAUTH_ERROR_USER_FETCH,
            });
          }
        }
      }

      if (auth === 'force-needed') {
        handleAuthForceNeeded();
      } else {
        try {
          const response = await apiRequest('/user');
          handleAuthSuccess(response);
        } catch (error) {
          handleAuthError({ error });
        }
      }
    },
    [authAppOptions, handleAuthError],
  );

  useEffect(
    () => {
      if (!authAppOptions.hasError || hasSession()) {
        validateSession();
      }
    },
    [authAppOptions.hasError, validateSession],
  );

  const renderErrorProps = {
    code: authAppOptions.code,
    auth: authAppOptions.auth,
    recordEvent,
    openLoginModal,
  };

  const view = authAppOptions.hasError ? (
    <RenderErrorUI {...renderErrorProps} />
  ) : (
    <va-loading-indicator message="Signing in to VA.gov..." />
  );

  return <div className="row vads-u-padding-y--5">{view}</div>;
}

const mapDispatchToProps = dispatch => ({
  openLoginModal: () => dispatch(toggleLoginModal(true)),
});

export default connect(
  null,
  mapDispatchToProps,
)(AuthApp2);

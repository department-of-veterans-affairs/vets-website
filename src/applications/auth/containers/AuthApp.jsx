import React from 'react';
import { connect } from 'react-redux';
import appendQuery from 'append-query';

import * as Sentry from '@sentry/browser';

import recordEvent from 'platform/monitoring/record-event';
import { toggleLoginModal } from 'platform/site-wide/user-nav/actions';
import {
  AUTH_EVENTS,
  AUTHN_SETTINGS,
  CSP_IDS,
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
  code,
  requestId,
}) => {
  const { message, errorCode } = getAuthError(code);

  Sentry.withScope(scope => {
    scope.setExtra('error', error);
    scope.setExtra(SENTRY_TAGS.REQUEST_ID, requestId);
    scope.setTag(SENTRY_TAGS.LOGIN_TYPE, loginType);
    scope.setTag(SENTRY_TAGS.ERROR_CODE, errorCode);
    Sentry.captureMessage(`Auth Error: ${errorCode} - ${message}`);
  });
};

export class AuthApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: this.props.location.query.auth === 'fail',
      loginType: this.props.location.query.type || 'Login type not found',
      returnUrl: sessionStorage.getItem(AUTHN_SETTINGS.RETURN_URL) || '',
      auth: this.props.location.query.auth || 'fail',
      code: this.props.location.query.code || '',
      state: this.props.location.query.state || '',
      requestId:
        this.props.location.query.request_id ||
        'No corresponding Request ID was found',
    };
  }

  componentDidMount() {
    if (this.state.hasError) {
      this.handleAuthError();
    } else if (!this.state.hasError) {
      this.validateSession();
    }
  }

  handleAuthError = error => {
    const { loginType, code, requestId } = this.state;
    const { errorCode } = getAuthError(code);

    generateSentryAuthError({
      error,
      loginType,
      code,
      requestId,
    });

    recordEvent({ event: AUTH_EVENTS.ERROR_USER_FETCH });

    this.setState(prevState => ({
      ...prevState,
      code: errorCode,
      hasError: true,
    }));
  };

  handleAuthForceNeeded = () => {
    // Handle redirect in the callback of the event data to ensure we process the even before navigation occurs
    recordEvent({
      event: AUTH_EVENTS.ERROR_FORCE_NEEDED,
      eventCallback: this.redirect,
      eventTimeout: 2000,
    });
  };

  handleAuthSuccess = ({ response = {}, skipToRedirect = false } = {}) => {
    sessionStorage.setItem('shouldRedirectExpiredSession', true);
    const { loginType, requestId, code } = this.state;
    const authMetrics = new AuthMetrics(loginType, response, requestId, code);
    authMetrics.run();
    if (!skipToRedirect) {
      setupProfileSession(authMetrics.userProfile);
    }
    this.redirect();
  };

  redirect = () => {
    const { returnUrl } = this.state;

    const handleRedirect = () => {
      sessionStorage.removeItem(AUTHN_SETTINGS.RETURN_URL);

      const updatedUrl = generateReturnURL(returnUrl);

      const postAuthUrl = updatedUrl
        ? appendQuery(updatedUrl, 'postLogin=true')
        : updatedUrl;

      const redirectUrl =
        (!returnUrl.match(REDIRECT_IGNORE_PATTERN) && postAuthUrl) || '/';

      window.location.replace(redirectUrl);
    };

    /*
      LOA3 enforcement for My VA Health (Cerner) will be moved to
      usip-config.js to create the initial auth request for a verified account.
    */

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

    /* ARP redirect */
    if (returnUrl.includes(EXTERNAL_REDIRECTS[EXTERNAL_APPS.ARP])) {
      window.location.replace(returnUrl);
    }

    handleRedirect();
  };

  handleTokenRequest = async ({ code, state, csp }) => {
    // Verify the state matches in storage
    if (
      !localStorage.getItem(OAUTH_KEYS.STATE) ||
      localStorage.getItem(OAUTH_KEYS.STATE) !== state
    ) {
      this.generateOAuthError({
        code: AUTH_ERRORS.OAUTH_STATE_MISMATCH.errorCode,
        event: OAUTH_ERRORS.OAUTH_STATE_MISMATCH,
      });
    } else {
      // Matches - requestToken exchange
      try {
        await requestToken({ code, csp });
      } catch (error) {
        const { errors } = await error.json();
        const errorCode = OAUTH_ERROR_RESPONSES[errors];
        const event = OAUTH_EVENTS[errors] ?? OAUTH_EVENTS.ERROR.DEFAULT;
        this.generateOAuthError({
          code: errorCode,
          event,
        });
      }
    }
  };

  // Fetch the user to get the login policy and validate the session.
  validateSession = async () => {
    const { code, state, auth, hasError, returnUrl } = this.state;

    if (code && state) {
      await this.handleTokenRequest({ code, state, csp: this.state.loginType });
    }

    if (auth === FORCE_NEEDED) {
      this.handleAuthForceNeeded();
    } else if (!hasError && this.checkReturnUrl(returnUrl)) {
      this.handleAuthSuccess({ skipToRedirect: true });
    } else {
      try {
        const response = await apiRequest('/user');
        this.handleAuthSuccess({ response });
      } catch (error) {
        this.handleAuthError(error);
      }
    }
  };

  checkReturnUrl = passedUrl => {
    return (
      passedUrl.includes(EXTERNAL_REDIRECTS[EXTERNAL_APPS.MHV]) ||
      passedUrl.includes(EXTERNAL_REDIRECTS[EXTERNAL_APPS.MY_VA_HEALTH]) ||
      passedUrl.includes(EXTERNAL_REDIRECTS[EXTERNAL_APPS.EBENEFITS]) ||
      passedUrl.includes(EXTERNAL_REDIRECTS[EXTERNAL_APPS.VA_OCC_MOBILE]) ||
      passedUrl.includes(EXTERNAL_REDIRECTS[EXTERNAL_APPS.ARP])
    );
  };

  generateOAuthError = ({ code, event = OAUTH_EVENTS.ERROR_DEFAULT }) => {
    recordEvent({ event });
    const { errorCode } = getAuthError(code);

    this.setState(prevState => ({
      ...prevState,
      code: errorCode,
      auth: AUTH_LEVEL.FAIL,
      hasError: true,
    }));
  };

  render() {
    const renderErrorProps = {
      code: getAuthError(this.state.code).errorCode,
      auth: this.state.auth,
      requestId: this.state.requestId,
      recordEvent,
      openLoginModal: this.props.openLoginModal,
    };

    const view = this.state.hasError ? (
      <RenderErrorUI {...renderErrorProps} />
    ) : (
      <va-loading-indicator message="Signing in to VA.gov..." />
    );
    return <div className="row vads-u-padding-y--5">{view}</div>;
  }
}

const mapDispatchToProps = dispatch => ({
  openLoginModal: () => dispatch(toggleLoginModal(true)),
});

export default connect(
  null,
  mapDispatchToProps,
)(AuthApp);

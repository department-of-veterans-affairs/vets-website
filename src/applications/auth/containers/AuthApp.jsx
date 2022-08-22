import React from 'react';
import { connect } from 'react-redux';
import appendQuery from 'append-query';

import * as Sentry from '@sentry/browser';

import recordEvent from 'platform/monitoring/record-event';
import { toggleLoginModal } from 'platform/site-wide/user-nav/actions';
import {
  AUTH_ERROR,
  AUTH_EVENTS,
  AUTH_LEVEL,
  AUTHN_SETTINGS,
  CSP_IDS,
  EXTERNAL_APPS,
  EXTERNAL_REDIRECTS,
  FORCE_NEEDED,
} from 'platform/user/authentication/constants';
import {
  hasSession,
  setupProfileSession,
} from 'platform/user/profile/utilities';
import { shouldRedirectToMyVA } from 'platform/user/selectors';
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

export class AuthApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: this.props.location.query.auth === 'fail',
      loginType: this.props.location.query.type || '',
      returnUrl: sessionStorage.getItem(AUTHN_SETTINGS.RETURN_URL) || '',
      auth: this.props.location.query.auth || '',
      code: this.props.location.query.code || '',
      state: this.props.location.query.state || '',
      requestId: sessionStorage.getItem(AUTHN_SETTINGS.REQUEST_ID),
    };
  }

  componentDidMount() {
    if (!this.state.hasError || hasSession()) {
      this.validateSession();
    }
  }

  handleAuthError = error => {
    const { loginType, code } = this.state;
    const errorCode = code.length === 3 ? code : '007';

    Sentry.withScope(scope => {
      scope.setExtra('error', { error: { error, code } });
      scope.setTag('loginType', loginType);
      Sentry.captureMessage(`User fetch error: ${error.message}`);
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

  handleAuthSuccess = payload => {
    sessionStorage.setItem('shouldRedirectExpiredSession', true);
    const { loginType } = this.state;
    const authMetrics = new AuthMetrics(loginType, payload);
    authMetrics.run();
    setupProfileSession(authMetrics.userProfile);
    this.redirect(authMetrics.userProfile);
  };

  redirect = (userProfile = {}) => {
    const { returnUrl } = this.state;
    const { redirectToMyVA } = this.props;

    const handleRedirect = () => {
      sessionStorage.removeItem(AUTHN_SETTINGS.RETURN_URL);

      const updatedUrl = generateReturnURL(returnUrl, redirectToMyVA);

      const postAuthUrl = updatedUrl
        ? appendQuery(updatedUrl, 'postLogin=true')
        : updatedUrl;

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

  handleTokenRequest = async ({ code, state, csp }) => {
    // Verify the state matches in storage
    if (
      !localStorage.getItem(OAUTH_KEYS.STATE) ||
      localStorage.getItem(OAUTH_KEYS.STATE) !== state
    ) {
      this.generateOAuthError({
        code: AUTH_ERROR.OAUTH_STATE_MISMATCH,
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
    const { code, state, auth } = this.state;

    if (code && state) {
      await this.handleTokenRequest({ code, state, csp: this.state.loginType });
    }

    if (auth === FORCE_NEEDED) {
      this.handleAuthForceNeeded();
    } else {
      try {
        const response = await apiRequest('/user');
        this.handleAuthSuccess(response);
      } catch (error) {
        this.handleAuthError(error);
      }
    }
  };

  generateOAuthError = ({ code, event = OAUTH_EVENTS.ERROR_DEFAULT }) => {
    recordEvent({ event });

    this.setState(prevState => ({
      ...prevState,
      code,
      auth: AUTH_LEVEL.FAIL,
      hasError: true,
    }));
  };

  render() {
    const renderErrorProps = {
      code: this.state.code,
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

const mapStateToProps = state => ({
  redirectToMyVA: shouldRedirectToMyVA(state),
});

const mapDispatchToProps = dispatch => ({
  openLoginModal: () => dispatch(toggleLoginModal(true)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AuthApp);

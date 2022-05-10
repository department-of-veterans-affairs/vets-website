import React from 'react';
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
import RenderErrorUI from '../components/RenderErrorContainer';
import AuthMetrics from './AuthMetrics';

const REDIRECT_IGNORE_PATTERN = new RegExp(
  ['/auth/login/callback', '/session-expired'].join('|'),
);

export class AuthApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: props.location.query.auth === 'fail',
      returnUrl: sessionStorage.getItem(AUTHN_SETTINGS.RETURN_URL) || '',
    };
  }

  componentDidMount() {
    if (!this.state.error || hasSession()) this.validateSession();
  }

  handleAuthError = error => {
    const loginType = this.props.location.query.type;

    Sentry.withScope(scope => {
      scope.setExtra('error', error);
      scope.setTag('loginType', loginType);
      Sentry.captureMessage(`User fetch error: ${error.message}`);
    });

    recordEvent({ event: AUTH_EVENTS.ERROR_USER_FETCH });

    this.setState({ error: true });
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
    const { type } = this.props.location.query;
    const authMetrics = new AuthMetrics(type, payload);
    authMetrics.run();
    setupProfileSession(authMetrics.userProfile);
    this.redirect(authMetrics.userProfile);
  };

  redirect = (userProfile = {}) => {
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
      const { app } = {
        ...(returnUrl.includes(
          EXTERNAL_REDIRECTS[EXTERNAL_APPS.MY_VA_HEALTH],
        ) && {
          app: CSP_IDS.CERNER,
        }),
        ...(returnUrl.includes(EXTERNAL_REDIRECTS[EXTERNAL_APPS.MHV]) && {
          app: CSP_IDS.MHV,
        }),
      };

      recordEvent({
        event: `login-inbound-redirect-to-${app}`,
        eventCallback: handleRedirect,
        eventTimeout: 2000,
      });
      return;
    }

    handleRedirect();
  };

  // Fetch the user to get the login policy and validate the session.
  validateSession = () => {
    if (this.props.location.query.auth === 'force-needed') {
      this.handleAuthForceNeeded();
    } else {
      apiRequest('/user')
        .then(this.handleAuthSuccess)
        .catch(this.handleAuthError);
    }
  };

  render() {
    const renderErrorProps = {
      code: this.props.location.query.code,
      auth: this.props.location.query.auth,
      recordEvent,
      openLoginModal: this.props.openLoginModal,
    };
    const view = this.state.error ? (
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

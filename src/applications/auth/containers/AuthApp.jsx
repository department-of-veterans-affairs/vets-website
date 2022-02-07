import React from 'react';
import { connect } from 'react-redux';
import appendQuery from 'append-query';

import * as Sentry from '@sentry/browser';

import recordEvent from 'platform/monitoring/record-event';
import { toggleLoginModal } from 'platform/site-wide/user-nav/actions';
import { loginGov } from 'platform/user/authentication/selectors';
import {
  AUTHN_SETTINGS,
  EXTERNAL_APPS,
  EXTERNAL_REDIRECTS,
  CSP_IDS,
  POLICY_TYPES,
  AUTH_EVENTS,
} from 'platform/user/authentication/constants';
import {
  hasSession,
  setupProfileSession,
} from 'platform/user/profile/utilities';
import { apiRequest } from 'platform/utilities/api';
import get from 'platform/utilities/data/get';
import RenderErrorUI from '../components/RenderErrorContainer';

const REDIRECT_IGNORE_PATTERN = new RegExp(
  ['/auth/login/callback', '/session-expired'].join('|'),
);

class AuthMetrics {
  constructor(type, payload) {
    this.type = type;
    this.payload = payload;
    this.userProfile = get('data.attributes.profile', payload, {});
    this.loaCurrent = get('loa.current', this.userProfile, null);
    this.serviceName = get('signIn.serviceName', this.userProfile, null);
  }

  compareLoginPolicy = () => {
    // This is experimental code related to GA that will let us determine
    // if the backend is returning an accurate service_name

    const attemptedLoginPolicy =
      this.type === CSP_IDS.MHV ? CSP_IDS.MHV_VERBOSE : this.type;

    if (this.serviceName !== attemptedLoginPolicy) {
      recordEvent({
        event: `login-mismatch-${attemptedLoginPolicy}-${this.serviceName}`,
      });
    }
  };

  recordGAAuthEvents = () => {
    switch (this.type) {
      case POLICY_TYPES.SIGNUP:
        recordEvent({ event: `register-success-${this.serviceName}` });
        break;
      case POLICY_TYPES.CUSTOM: /* type=custom is used for SSOe auto login */
      case CSP_IDS.MHV:
      case CSP_IDS.DS_LOGON:
      case CSP_IDS.ID_ME:
      case CSP_IDS.LOGIN_GOV:
        recordEvent({ event: `login-success-${this.serviceName}` });
        this.compareLoginPolicy();
        break;
      default:
        recordEvent({ event: `login-or-register-success-${this.serviceName}` });
        Sentry.withScope(scope => {
          scope.setExtra('type', this.type || 'N/A');
          Sentry.captureMessage('Unrecognized auth event type');
        });
    }

    // Report out the current level of assurance for the user.
    if (this.loaCurrent) {
      recordEvent({ event: `login-loa-current-${this.loaCurrent}` });
    }
  };

  reportSentryErrors = () => {
    if (!Object.keys(this.userProfile).length) {
      Sentry.captureMessage('Unexpected response for user object');
    } else if (!this.serviceName) {
      Sentry.captureMessage('Missing serviceName in user object');
    }
  };

  run = () => {
    this.reportSentryErrors();
    if (!hasSession()) this.recordGAAuthEvents();
  };
}

export class AuthApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: props.location.query.auth === 'fail' };
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
    recordEvent({ event: AUTH_EVENTS.ERROR_FORCE_NEEDED });
    this.redirect();
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
      recordEvent({ event: `login-inbound-redirect-to-${app}` });
    }

    sessionStorage.removeItem(AUTHN_SETTINGS.RETURN_URL);

    const postAuthUrl = returnUrl
      ? appendQuery(returnUrl, 'postLogin=true')
      : returnUrl;

    const redirectUrl =
      (!returnUrl.match(REDIRECT_IGNORE_PATTERN) && postAuthUrl) || '/';

    window.location.replace(redirectUrl);
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
      loginGovEnabled: this.props.loginGovEnabled,
      openLoginModal: this.props.openLoginModal,
    };
    const view = this.state.error ? (
      <RenderErrorUI {...renderErrorProps} />
    ) : (
      <va-loading-indicator message={`Signing in to VA.gov...`} />
    );

    return <div className="row vads-u-padding-y--5">{view}</div>;
  }
}

const mapDispatchToProps = dispatch => ({
  openLoginModal: () => dispatch(toggleLoginModal(true)),
});

const mapStateToProps = state => ({
  loginGovEnabled: loginGov(state),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AuthApp);

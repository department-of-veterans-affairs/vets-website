import React from 'react';
import { connect } from 'react-redux';
import appendQuery from 'append-query';

import * as Sentry from '@sentry/browser';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';

import recordEvent from 'platform/monitoring/record-event';
import { toggleLoginModal } from 'platform/site-wide/user-nav/actions';
import { authnSettings } from 'platform/user/authentication/utilities';
import {
  hasSession,
  setupProfileSession,
} from 'platform/user/profile/utilities';
import { apiRequest } from 'platform/utilities/api';
import get from 'platform/utilities/data/get';
import { ssoe } from 'platform/user/authentication/selectors';
import environment from 'platform/utilities/environment';

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
      this.type === 'mhv' ? 'myhealthevet' : this.type;

    if (this.serviceName !== attemptedLoginPolicy) {
      recordEvent({
        event: `login-mismatch-${attemptedLoginPolicy}-${this.serviceName}`,
      });
    }
  };

  recordGAAuthEvents = () => {
    switch (this.type) {
      case 'signup':
        recordEvent({ event: `register-success-${this.serviceName}` });
        break;
      case 'mhv':
      case 'dslogon':
      case 'idme':
        recordEvent({ event: `login-success-${this.serviceName}` });
        this.compareLoginPolicy();
        break;
      /*
      case 'mfa':
        recordEvent({ event: `multifactor-success-${this.serviceName}` });
        break;
      case 'verify':
        recordEvent({ event: `verify-success-${this.serviceName}` });
        break;
      */
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

    recordEvent({ event: `login-error-user-fetch` });

    this.setState({ error: true });
  };

  handleAuthForceNeeded = () => {
    recordEvent({ event: `login-failed-force-needed` });
    this.redirect();
  };

  handleAuthSuccess = payload => {
    sessionStorage.setItem('shouldRedirectExpiredSession', true);
    const { type } = this.props.location.query;
    const authMetrics = new AuthMetrics(type, payload);
    authMetrics.run();
    setupProfileSession(authMetrics.userProfile, this.props.useSSOe);
    this.redirect();
  };

  redirect = () => {
    const returnUrl = sessionStorage.getItem(authnSettings.RETURN_URL) || '';
    sessionStorage.removeItem(authnSettings.RETURN_URL);

    const postAuthUrl =
      returnUrl.includes('?next=') && !environment.isProduction()
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

  renderError = () => {
    const { code, auth } = this.props.location.query;
    let header = 'We couldn’t sign you in';
    let alertContent;
    let troubleshootingContent;

    if (auth === 'fail') {
      recordEvent({
        event: code ? `login-error-code-${code}` : `login-error-no-code`,
      });
    }

    switch (code) {
      // Authorization was denied by user
      case '001':
        alertContent = (
          <p>
            We’re sorry. We couldn’t complete the identity verification process.
            It looks like you selected “Deny” when we asked for your permission
            to share your information with VA.gov. We can’t give you access to
            all the tools on VA.gov without sharing your information with the
            site.
          </p>
        );
        troubleshootingContent = (
          <>
            <h3>What you can do:</h3>
            <p>
              Please try again, and this time, select “Accept” on the final page
              of the identity verification process. Or, if you don’t want to
              verify your identity with ID.me, you can try signing in with your
              premium DS Logon or premium My HealtheVet username and password.
            </p>
            <button onClick={this.props.openLoginModal}>
              Try signing in again
            </button>
          </>
        );
        break;

      // User's clock is incorrect
      case '002':
        header = 'Please update your computer’s time settings';
        alertContent = (
          <p>
            We’re sorry. It looks like your computer’s clock isn’t showing the
            right time, and that’s causing a problem in how it communicates with
            our system.
          </p>
        );
        troubleshootingContent = (
          <>
            <h3>What you can do:</h3>
            <p>
              Please update your computer’s settings to the current date and
              time, and then try again.
            </p>
          </>
        );
        break;

      // Server error
      case '003':
        alertContent = (
          <p>
            We’re sorry. Something went wrong on our end, and we couldn’t sign
            you in. Please try signing in again.
          </p>
        );
        troubleshootingContent = (
          <>
            <h3>What you can do:</h3>
            <p>
              <strong>Please try signing in again.</strong> If you still can’t
              sign in, please use our online form to submit a request for help.
            </p>
            <p>
              <a
                href="https://www.accesstocare.va.gov/sign-in-help?_ga=2.9898741.1324318578.1552319576-1143343955.1509985973"
                target="_blank"
                rel="noopener noreferrer"
              >
                Submit a request to get help signing in
              </a>
            </p>
            <button onClick={this.props.openLoginModal}>
              Try signing in again
            </button>
          </>
        );
        break;

      // We're having trouble matching the user with MVI
      case '004':
        header = 'Please try again later';
        alertContent = (
          <p>
            We’re sorry. Something went wrong on our end, and we couldn’t sign
            you in. Please try again later.
          </p>
        );
        troubleshootingContent = (
          <>
            <h3>What you can do:</h3>
            <p>
              <strong>Please try signing in again.</strong> If you still can’t
              sign in, please use our online form to submit a request for help.
            </p>
            <p>
              <a
                href="https://www.accesstocare.va.gov/sign-in-help?_ga=2.9898741.1324318578.1552319576-1143343955.1509985973"
                target="_blank"
                rel="noopener noreferrer"
              >
                Submit a request to get help signing in
              </a>
            </p>
            <button onClick={this.props.openLoginModal}>
              Try signing in again
            </button>
          </>
        );
        break;

      // Session expired error
      case '005':
        header = 'We’ve signed you out of VA.gov';
        alertContent = (
          <p>
            We take your privacy very seriously. You didn’t take any action on
            VA.gov for 30 minutes, so we signed you out of the site to protect
            your personal information.
          </p>
        );
        troubleshootingContent = (
          <>
            <h3>What you can do:</h3>
            <p>Please sign in again.</p>
            <button onClick={this.props.openLoginModal}>Sign in</button>
          </>
        );
        break;

      // Multiple MHV ID error
      case '101':
        header = 'We can’t sign you in';
        alertContent = (
          <p>
            We’re having trouble signing you in to VA.gov right now because we
            found more than one MyHealtheVet account for you.
          </p>
        );
        troubleshootingContent = (
          <>
            <h3>How can I fix this issue?</h3>
            <ul>
              <li>
                <strong>Call the My HealtheVet help desk</strong>
                <p>
                  Call us at <a href="tel:877-327-0022">877-327-0022</a>. We’re
                  here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET. If you
                  have hearing loss, call TTY: 800-877-3399.
                </p>
                <p>
                  Tell the representative that you tried to sign in to VA.gov,
                  but got an error message that you have more than one My
                  HealtheVet account.
                </p>
              </li>
              <li>
                <strong>Submit a request for online help</strong>
                <p>
                  Fill out a
                  <a
                    href="https://www.myhealth.va.gov/mhv-portal-web/contact-us"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    MyHealtheVet online help form
                  </a>{' '}
                  to get help signing in. Enter the following information in the
                  form fields.
                </p>
                <p>
                  <strong>Fill in the form fields as below:</strong>
                </p>
                <ul>
                  <li>Topic: Select "Account Login"</li>
                  <li>Category: Select "Request for Assistance"</li>
                  <li>
                    Comments: Type, or copy and paste, the below message:
                    <br />
                    “When I tried to sign in to VA.gov, I got an error message
                    saying that I have more than one MyHealtheVet account.”
                  </li>
                </ul>
                <p>Complete the rest of the form and then click Submit.</p>
              </li>
            </ul>
          </>
        );
        break;

      // Multiple EDIPI error
      case '102':
        header = 'We can’t sign you in';
        alertContent = (
          <p>
            We’re having trouble signing you in to VA.gov right now because we
            found more than one DoD ID number for you. To fix this issue, please{' '}
            <a
              href="https://www.accesstocare.va.gov/sign-in-help?_ga=2.9898741.1324318578.1552319576-1143343955.1509985973"
              target="_blank"
              rel="noopener noreferrer"
            >
              submit a request to get help signing in.
            </a>
          </p>
        );
        troubleshootingContent = null;
        break;

      // ICN mismatch error
      case '103':
        header = 'We can’t sign you in';
        alertContent = (
          <p>
            We’re having trouble signing you in right now because your My
            HealtheVet account number doesn’t match the account number on your
            VA.gov account. To fix this issue, please{' '}
            <a
              href="https://www.accesstocare.va.gov/sign-in-help?_ga=2.9898741.1324318578.1552319576-1143343955.1509985973"
              target="_blank"
              rel="noopener noreferrer"
            >
              submit a request to get help signing in.
            </a>
          </p>
        );
        troubleshootingContent = null;
        break;

      // Catch all generic error
      default:
        alertContent = (
          <p>
            We’re sorry. Something went wrong on our end, and we couldn’t sign
            you in.
          </p>
        );
        troubleshootingContent = (
          <>
            <h3>What you can do:</h3>
            <p>
              <strong>Try taking these steps to fix the problem:</strong>
            </p>
            <ul>
              <li>
                Clear your Internet browser’s cookies and cache. Depending on
                which browser you’re using, you’ll usually find this information
                referred to as “Browsing Data,”, “Browsing History,” or “Website
                Data.”
              </li>
              <li>
                Make sure you have cookies enabled in your browser settings.
                Depending on which browser you’re using, you’ll usually find
                this information in the “Tools,” “Settings,” or
                “Preferences” menu.
              </li>
              <li>
                <p>
                  If you’re using Internet Explorer or Microsoft Edge, and
                  clearing your cookies and cache doesn’t fix the problem, try
                  using Google Chrome or Mozilla Firefox as your browser
                  instead.
                </p>
                <p>
                  <a
                    href="https://www.google.com/chrome/?brand=CHBD&gclid=Cj0KCQiAsdHhBRCwARIsAAhRhsk_uwlqzTaYptK2zKbuv-5g5Zk9V_qaKTe1Y5ptlxudmMG_Y7XqyDkaAs0HEALw_wcB&gclsrc=aw.ds"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download Google Chrome
                  </a>
                </p>
                <p>
                  <a
                    href="https://www.mozilla.org/en-US/firefox/new/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download Mozilla Firefox
                  </a>
                </p>
              </li>
              <li>
                If you’re using Chrome or Firefox and it’s not working, make
                sure you’ve updated your browser with the latest updates.
              </li>
            </ul>
            <p>
              <strong>
                If you’ve taken the steps above and still can’t sign in,
              </strong>{' '}
              please use our online form to submit a request for help.
            </p>
            <p>
              <a
                href="https://www.accesstocare.va.gov/sign-in-help?_ga=2.9898741.1324318578.1552319576-1143343955.1509985973"
                target="_blank"
                rel="noopener noreferrer"
              >
                Submit a request to get help signing in
              </a>
            </p>
          </>
        );
    }

    return (
      <div className="usa-content columns small-12">
        <h1>{header}</h1>
        <AlertBox content={alertContent} isVisible status="error" />
        {troubleshootingContent}
      </div>
    );
  };

  render() {
    const view = this.state.error ? (
      this.renderError()
    ) : (
      <LoadingIndicator message={`Signing in to VA.gov...`} />
    );

    return <div className="row vads-u-padding-y--5">{view}</div>;
  }
}

const mapStateToProps = state => ({
  useSSOe: ssoe(state),
});

const mapDispatchToProps = dispatch => ({
  openLoginModal: () => dispatch(toggleLoginModal(true)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AuthApp);

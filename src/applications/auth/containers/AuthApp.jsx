import React from 'react';
import { connect } from 'react-redux';

import Raven from 'raven-js';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';

import siteName from '../../../platform/brand-consolidation/site-name';
import { toggleLoginModal } from '../../../platform/site-wide/user-nav/actions';
import { authnSettings } from '../../../platform/user/authentication/utilities';
import {
  hasSession,
  setupProfileSession,
} from '../../../platform/user/profile/utilities';
import { apiRequest } from '../../../platform/utilities/api';

import recordEvent from '../../../platform/monitoring/record-event';

export class AuthApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: props.location.query.auth === 'fail' };
  }

  componentDidMount() {
    if (!this.state.error || hasSession()) this.validateSession();
  }

  handleAuthError = e => {
    const loginType = sessionStorage.getItem(
      authnSettings.PENDING_LOGIN_POLICY,
    );

    Raven.captureMessage(`User fetch error: ${e.message}`, {
      extra: {
        error: e,
      },
      tags: {
        loginType,
      },
    });

    recordEvent({ event: `login-error-user-fetch` });

    this.setState({ error: true });
  };

  handleAuthSuccess = payload => {
    setupProfileSession(payload);
    this.redirect();
  };

  redirect = () => {
    const returnUrl = sessionStorage.getItem(authnSettings.RETURN_URL) || '';
    sessionStorage.removeItem(authnSettings.RETURN_URL);

    const redirectUrl =
      (!returnUrl.match(window.location.pathname) && returnUrl) || '/';

    window.location.replace(redirectUrl);
  };

  // Fetch the user to get the login policy and validate the session.
  validateSession = () => {
    apiRequest('/user', null, this.handleAuthSuccess, this.handleAuthError);
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
        <h3>What you can do:</h3>
        {troubleshootingContent}
      </div>
    );
  };

  render() {
    const view = this.state.error ? (
      this.renderError()
    ) : (
      <LoadingIndicator message={`Signing in to ${siteName}...`} />
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

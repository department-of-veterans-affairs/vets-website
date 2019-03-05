import React from 'react';

import Raven from 'raven-js';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';

import siteName from '../../../platform/brand-consolidation/site-name';
import { authnSettings } from '../../../platform/user/authentication/utilities';
import {
  hasSession,
  setupProfileSession,
} from '../../../platform/user/profile/utilities';
import { apiRequest } from '../../../platform/utilities/api';

import facilityLocator from '../../facility-locator/manifest';
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

    recordEvent({
      event: `login-error-user-fetch`,
    });

    this.setState({ error: true });
  };

  handleAuthSuccess = payload => {
    setupProfileSession(payload);
    this.redirect();
  };

  redirect = () => {
    const returnUrl = sessionStorage.getItem(authnSettings.RETURN_URL) || '';
    sessionStorage.removeItem(authnSettings.RETURN_URL);

    window.location =
      (!returnUrl.match(window.location.pathname) && returnUrl) || '/';
  };

  // Fetch the user to get the login policy and validate the session.
  validateSession = () => {
    apiRequest('/user', null, this.handleAuthSuccess, this.handleAuthError);
  };

  renderError = () => {
    const { code, auth } = this.props.location.query;
    let alertProps;

    if (auth === 'fail') {
      recordEvent({
        event: code ? `login-error-code-${code}` : `login-error-no-code`,
      });
    }

    switch (code) {
      // User selected Deny on share info prompt
      case '001':
        alertProps = {
          headline: 'We couldn’t complete the sign-in process',
          content: (
            <div>
              <p>
                We’re sorry. It looks like you selected "Deny" on the last page
                when asked for your permission to share information with
                {siteName}, so we couldn’t complete the process. To give you
                full access to the tools on {siteName}, we need to be able to
                share your information with the site.
              </p>
              <p>
                Please try again and click “Accept” on the final page. Or, you
                can try signing in with your premium DS Logon or premium My
                HealtheVet account instead of identity proofing with ID.me.
              </p>
            </div>
          ),
        };
        break;

      // User time too early/late
      case '002':
      case '003':
        alertProps = {
          headline: 'Please update your computer’s time settings',
          content: (
            <p>
              We’re sorry. It looks like your computer’s clock isn’t showing the
              right time, and that’s causing a problem in how it communicates
              with our system. Please update your computer’s settings to the
              current date and time, and then try again.
            </p>
          ),
        };
        break;

      // User/Session Validation Failed
      case '004':
        alertProps = {
          headline: 'We can’t match your information to our Veteran records',
          content: (
            <div>
              <p>
                We’re sorry. We can’t verify your identity because we can’t
                match your information to our Veteran records.
              </p>
              <p>
                Please check the information you entered and make sure it
                matches the information in your records. If you feel you’ve
                entered your information correctly, and it’s still not matching,
                please contact your nearest VA medical center. Let them know you
                need to verify the information in your records, and update it as
                needed. The operator, or a patient advocate, can connect with
                you with the right person who can help.
              </p>
              <p>
                <a
                  href={`${
                    facilityLocator.rootUrl
                  }/?facilityType=health&page=1&zoomLevel=7`}
                >
                  Find your nearest VA medical center.
                </a>
              </p>
            </div>
          ),
        };
        break;

      // Unknown SAML Login Error
      case '007':
      default:
        alertProps = {
          headline: 'We couldn’t sign you in',
          content: (
            <div>
              <p>We’re sorry. Something went wrong on our end.</p>
              <p>
                Please read our answers to frequently asked questions about
                common issues with signing in to VA.gov. These answers offer
                steps you can take to try to fix the issue and a form to submit
                a request for more help if needed.
              </p>
              <p>
                <a href="/sign-in-faq/#sign-in-issue">
                  Go to the sign in FAQs.
                </a>
              </p>
            </div>
          ),
        };
    }

    return (
      <AlertBox
        {...alertProps}
        isVisible
        status="error"
        onCloseAlert={window.close}
      />
    );
  };

  render() {
    const view = this.state.error ? (
      this.renderError()
    ) : (
      <LoadingIndicator message={`Signing in to ${siteName}...`} />
    );

    return (
      <div className="row">
        <div className="small-12 columns">{view}</div>
      </div>
    );
  }
}

export default AuthApp;

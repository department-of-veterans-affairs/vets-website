import React from 'react';
import { connect } from 'react-redux';
import URLSearchParams from 'url-search-params';

import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import Telephone, {
  CONTACTS,
} from '@department-of-veterans-affairs/component-library/Telephone';
import recordEvent from 'platform/monitoring/record-event';

import {
  isAuthenticatedWithSSOe,
  loginGov,
} from 'platform/user/authentication/selectors';
import { verify } from 'platform/user/authentication/utilities';
import { hasSession } from 'platform/user/profile/utilities';
import SubmitSignInForm from 'platform/static-data/SubmitSignInForm';
import { focusElement } from '~/platform/utilities/ui';

export class VerifyApp extends React.Component {
  constructor(props) {
    super(props);
    const { profile } = this.props;
    const serviceName = (profile.signIn || {}).serviceName;

    const signinMethodLabels = {
      dslogon: 'DS Logon',
      myhealthevet: 'My HealtheVet',
    };

    this.signInMethod = signinMethodLabels[serviceName] || 'ID.me';
  }
  componentDidMount() {
    if (!hasSession()) {
      window.location.replace('/');
    } else {
      recordEvent({ event: 'verify-prompt-displayed' });
    }
  }

  componentDidUpdate(prevProps) {
    const { verified } = this.props.profile;
    const shouldCheckAccount = prevProps.profile.verified !== verified;
    if (shouldCheckAccount) {
      this.checkAccountAccess();
    }
    if (!this.props.profile.loading && prevProps.profile.loading) {
      focusElement('h1');
    }
  }

  checkAccountAccess() {
    if (this.props.profile.verified) {
      const nextParams = new URLSearchParams(window.location.search);
      const nextPath = nextParams.get('next');
      window.location.replace(nextPath || '/');
    }
  }

  renderVerifyButton() {
    const { loginGovEnabled, authenticatedWithSSOe } = this.props;
    const authVersion = authenticatedWithSSOe ? 'v1' : 'v0';
    const copy = loginGovEnabled ? 'Login.gov' : 'ID.me';
    const iconPath = loginGovEnabled
      ? '/img/signin/logingov-icon-white.svg'
      : '/img/signin/idme-icon-white.svg';
    const alt = loginGovEnabled ? 'Login.gov' : 'ID.me';

    return (
      <button
        className="usa-button usa-button-darker"
        onClick={() => verify(authVersion)}
      >
        <strong>
          Verify with <span className="sr-only">{copy}</span>
        </strong>
        <img alt={alt} role="presentation" aria-hidden="true" src={iconPath} />
      </button>
    );
  }

  render() {
    const { profile } = this.props;

    if (profile.loading) {
      return <LoadingIndicator message="Loading the application..." />;
    }

    return (
      <main className="verify">
        <div className="container">
          <div className="row">
            <div className="columns small-12">
              <div>
                <h1>Verify your identity</h1>
                <AlertBox
                  content={`You signed in with ${this.signInMethod}`}
                  isVisible
                  status="success"
                />
                <p>
                  We'll need to verify your identity so that you can securely
                  access and manage your benefits.
                  <br />
                  <a
                    href="/resources/privacy-and-security-on-vagov/#why-do-i-need-to-verify-my-ide"
                    target="_blank"
                  >
                    Why does VA.gov verify identity?
                  </a>
                </p>
                <p>
                  This one-time process will take{' '}
                  <strong>5 - 10 minutes</strong> to complete.
                </p>
                {this.renderVerifyButton()}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="columns small-12">
              <div className="help-info">
                <h4>Having trouble verifying your identity?</h4>
                <p>
                  <a href="/resources/signing-in-to-vagov/" target="_blank">
                    Get answers to frequently asked questions
                  </a>
                </p>
                <p>
                  <SubmitSignInForm startSentence>
                    Call the VA.gov Help Desk at{' '}
                    <a href="tel:1-855-574-7286">855-574-7286</a>, TTY:{' '}
                    <Telephone contact={CONTACTS.HELP_TTY} />
                    <br />
                    Monday &#8211; Friday, 8:00 a.m. &#8211; 8:00 p.m. ET
                  </SubmitSignInForm>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
}

const mapStateToProps = state => {
  const userState = state.user;
  return {
    login: userState.login,
    profile: userState.profile,
    loginGovEnabled: loginGov(state),
    authenticatedWithSSOe: isAuthenticatedWithSSOe(state),
  };
};

export default connect(mapStateToProps)(VerifyApp);

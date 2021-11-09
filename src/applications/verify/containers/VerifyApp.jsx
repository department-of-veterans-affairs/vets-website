import React from 'react';
import { connect } from 'react-redux';
import URLSearchParams from 'url-search-params';

import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
import LoginGovSVG from 'applications/login/components/LoginGov';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import recordEvent from 'platform/monitoring/record-event';

import { loginGov } from 'platform/user/authentication/selectors';
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
    const { loginGovEnabled } = this.props;
    const renderOpts = {
      copy: loginGovEnabled ? 'Login.gov' : 'ID.me',
      renderImage: loginGovEnabled ? (
        <LoginGovSVG />
      ) : (
        <img
          role="presentation"
          aria-hidden="true"
          alt="ID.me"
          src="/img/signin/idme-icon-white.svg"
        />
      ),
      className: `usa-button ${
        loginGovEnabled ? 'logingov-button' : 'idme-button'
      }`,
    };

    return (
      <button className={renderOpts.className} onClick={() => verify()}>
        <strong>
          Verify with <span className="sr-only">{renderOpts.copy}</span>
        </strong>
        {renderOpts.renderImage}
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
                  <SubmitSignInForm startSentence />
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
  };
};

export default connect(mapStateToProps)(VerifyApp);

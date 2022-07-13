import React from 'react';
import { connect } from 'react-redux';
import URLSearchParams from 'url-search-params';

import LoginGovSVG from 'platform/user/authentication/components/LoginGovSVG';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import recordEvent from 'platform/monitoring/record-event';

import { verify } from 'platform/user/authentication/utilities';
import { hasSession } from 'platform/user/profile/utilities';
import SubmitSignInForm from 'platform/static-data/SubmitSignInForm';
import { CSP_IDS } from 'platform/user/authentication/constants';
import { focusElement } from '~/platform/utilities/ui';

export class VerifyApp extends React.Component {
  constructor(props) {
    super(props);

    const { MHV, MHV_VERBOSE, DS_LOGON, LOGIN_GOV } = CSP_IDS;

    this.signinMethodLabels = {
      [DS_LOGON]: 'DS Logon',
      [LOGIN_GOV]: 'Login.gov',
      [MHV]: 'My HealtheVet',
      [MHV_VERBOSE]: 'My HealtheVet',
    };
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
      if (nextPath && nextPath !== 'loginModal') {
        window.location.replace(nextPath || '/');
      }
    }
  }

  verifyButton(signInMethod) {
    const renderOpts = [
      {
        copy: 'Login.gov',
        renderImage: <LoginGovSVG />,
        className: `logingov-button`,
        link: 'logingov',
      },
      {
        copy: 'ID.me',
        renderImage: (
          <img
            role="presentation"
            aria-hidden="true"
            alt="ID.me"
            src="/img/signin/idme-icon-white.svg"
          />
        ),
        className: `idme-button`,
        link: 'idme',
      },
    ];

    if (signInMethod === this.signinMethodLabels.myhealthevet) {
      return renderOpts.map(({ copy, renderImage, className, link }) => (
        <button
          key={copy}
          type="button"
          className={className}
          onClick={() => verify(link)}
        >
          <strong>
            Verify with <span className="sr-only">{copy}</span>
          </strong>
          {renderImage}
        </button>
      ));
    }
    const { className, copy, renderImage, link } = renderOpts[0];
    return (
      <button
        type="button"
        className={`usa-button ${className}`}
        onClick={() => verify(link)}
      >
        <strong>
          Verify with <span className="sr-only">{copy}</span>
        </strong>
        {renderImage}
      </button>
    );
  }

  render() {
    const { profile } = this.props;
    const signInMethod =
      this.signinMethodLabels[(profile?.signIn?.serviceName)] || 'ID.me';

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
                <va-alert visible status="success">
                  You signed in with {signInMethod}
                </va-alert>
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
                {this.verifyButton(signInMethod)}
                <div />
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
  };
};

export default connect(mapStateToProps)(VerifyApp);

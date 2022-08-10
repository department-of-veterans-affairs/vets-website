import React from 'react';
import { connect } from 'react-redux';
import URLSearchParams from 'url-search-params';
import PropTypes from 'prop-types';

import LoginGovSVG from 'platform/user/authentication/components/LoginGovSVG';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import recordEvent from 'platform/monitoring/record-event';

import { hasSession } from 'platform/user/profile/utilities';
import SubmitSignInForm from 'platform/static-data/SubmitSignInForm';
import { SERVICE_PROVIDERS } from 'platform/user/authentication/constants';
import { focusElement } from '~/platform/utilities/ui';
import { VerifyButton } from '../components/verifyButton';

export class VerifyApp extends React.Component {
  constructor(props) {
    super(props);

    this.renderOpts = [
      {
        copy: 'Login.gov',
        renderImage: <LoginGovSVG />,
        className: `logingov-button`,
        policy: 'logingov',
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
        policy: 'idme',
      },
    ];
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
    const { idme, logingov } = SERVICE_PROVIDERS;
    if ([idme.label, logingov.label].includes(signInMethod)) {
      const selectCSP = signInCSP =>
        this.renderOpts.find(csp => csp.copy === signInCSP);
      const verifyButtonProps = selectCSP(signInMethod);
      return <VerifyButton {...verifyButtonProps} />;
    }
    return this.renderOpts.map(props => (
      <VerifyButton key={props.policy} {...props} />
    ));
  }

  render() {
    const { profile } = this.props;

    const signInMethod = profile.loading
      ? null
      : SERVICE_PROVIDERS[profile.signIn.serviceName].label;

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

VerifyApp.propTypes = {
  profile: PropTypes.object.isRequired,
  login: PropTypes.object,
};

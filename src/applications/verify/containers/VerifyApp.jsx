import React from 'react';
import { connect } from 'react-redux';
import URLSearchParams from 'url-search-params';

import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import recordEvent from 'platform/monitoring/record-event';

import { ssoe } from 'platform/user/authentication/selectors';
import { verify } from 'platform/user/authentication/utilities';
import { hasSession } from 'platform/user/profile/utilities';
import SubmitSignInForm from 'platform/static-data/SubmitSignInForm';

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
  }

  checkAccountAccess() {
    if (this.props.profile.verified) {
      const nextParams = new URLSearchParams(window.location.search);
      const nextPath = nextParams.get('next');
      window.location.replace(nextPath || '/');
    }
  }

  render() {
    const { profile } = this.props;
    const authVersion = this.props.useSSOe ? 'v1' : 'v0';

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
                  <a href="/sign-in-faq/#why-verify" target="_blank">
                    Why does VA.gov verify identity?
                  </a>
                </p>
                <p>
                  This one-time process will take{' '}
                  <strong>5 - 10 minutes</strong> to complete.
                </p>
                <button
                  className="usa-button-primary va-button-primary"
                  onClick={() => verify(authVersion)}
                >
                  <img alt="ID.me" src="/img/signin/idme-icon-white.svg" />
                  <strong> Verify with ID.me</strong>
                </button>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="columns small-12">
              <div className="help-info">
                <h4>Having trouble verifying your identity?</h4>
                <p>
                  <a href="/sign-in-faq/" target="_blank">
                    Get answers to Frequently Asked Questions
                  </a>
                </p>
                <p>
                  <SubmitSignInForm startSentence>
                    Call the VA.gov Help Desk at{' '}
                    <a href="tel:1-855-574-7286">855-574-7286</a>, TTY:{' '}
                    <a href="tel:18008778339">800-877-8339</a>
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
    useSSOe: ssoe(state),
  };
};

export default connect(mapStateToProps)(VerifyApp);

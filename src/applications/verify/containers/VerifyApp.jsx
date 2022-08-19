import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { selectProfile } from 'platform/user/selectors';

import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import recordEvent from 'platform/monitoring/record-event';

import { hasSession } from 'platform/user/profile/utilities';
import SubmitSignInForm from 'platform/static-data/SubmitSignInForm';
import { SERVICE_PROVIDERS } from 'platform/user/authentication/constants';
import { focusElement } from '~/platform/utilities/ui';
import { VerifyButton } from '../components/verifyButton';

const selectCSP = selectedPolicy =>
  Object.values(SERVICE_PROVIDERS).find(csp => csp.policy === selectedPolicy);

export class VerifyApp extends React.Component {
  componentDidMount() {
    if (!hasSession()) {
      window.location.replace('/');
    } else {
      recordEvent({ event: 'verify-prompt-displayed' });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.profile.verified) {
      window.location.replace('/');
    }

    if (!this.props.profile.loading && prevProps.profile.loading) {
      focusElement('h1');
    }
  }

  render() {
    const { profile } = this.props;

    if (profile.loading) {
      return <LoadingIndicator message="Loading the application..." />;
    }

    const { idme, logingov } = SERVICE_PROVIDERS;
    const signInMethod = !profile.loading && profile.signIn.serviceName;

    return (
      <section className="verify">
        <div className="container">
          <div className="row">
            <div className="columns small-12 fed-warning--v2">
              <h1>Verify your identity</h1>
              <va-alert visible status="success">
                You signed in with {SERVICE_PROVIDERS[signInMethod].label}
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
                This one-time process will take <strong>5 - 10 minutes</strong>{' '}
                to complete.
              </p>
              {[idme.policy, logingov.policy].includes(signInMethod) ? (
                <VerifyButton {...selectCSP(signInMethod)} />
              ) : (
                <>
                  <VerifyButton {...selectCSP(logingov.policy)} />
                  <VerifyButton {...selectCSP(idme.policy)} />
                </>
              )}
              <div className="help-info">
                <h2>Having trouble verifying your identity?</h2>
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
      </section>
    );
  }
}

const mapStateToProps = state => ({
  profile: selectProfile(state),
});

export default connect(mapStateToProps)(VerifyApp);

VerifyApp.propTypes = {
  profile: PropTypes.object.isRequired,
};

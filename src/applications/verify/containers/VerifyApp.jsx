import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as Sentry from '@sentry/browser';
import { selectProfile, isProfileLoading } from 'platform/user/selectors';
import recordEvent from 'platform/monitoring/record-event';
import { hasSession } from 'platform/user/profile/utilities';
import SubmitSignInForm from 'platform/static-data/SubmitSignInForm';
import { SERVICE_PROVIDERS } from 'platform/user/authentication/constants';
import { VerifyButton } from 'platform/user/authentication/components/VerifyButton';
import { isAuthenticatedWithOAuth } from 'platform/user/authentication/selectors';
import { focusElement } from '~/platform/utilities/ui';

export const selectCSP = selectedPolicy =>
  Object.values(SERVICE_PROVIDERS).find(csp => csp.policy === selectedPolicy);

export const VerifyApp = ({ profile, useOAuth, loading }) => {
  useEffect(
    () => {
      if (!hasSession() || (hasSession() && profile.verified)) {
        window.location.replace('/');
      }

      Sentry.captureMessage('verify-prompt-displayed');
      recordEvent({ event: 'verify-prompt-displayed' });

      if (!loading) {
        focusElement('h1');
      }
    },
    [loading, profile.verified],
  );

  if (loading) {
    return (
      <va-loading-indicator
        data-testid="loading-indicator"
        message="Loading the application..."
      />
    );
  }
  const { idme, logingov } = SERVICE_PROVIDERS;
  const signInMethod = !profile.loading && profile.signIn.serviceName;

  return (
    <section data-testid="verify-app" className="verify">
      <div className="container">
        <div className="row">
          <div className="columns small-12 fed-warning--v2">
            <h1>Verify your identity</h1>
            <va-alert visible status="success">
              You signed in with {SERVICE_PROVIDERS[signInMethod].label}
            </va-alert>
            <p>
              We’ll need to verify your identity so that you can securely access
              and manage your benefits.
              <br />
              <a
                href="/resources/privacy-and-security-on-vagov/#why-do-i-need-to-verify-my-ide"
                target="_blank"
              >
                Why does VA.gov verify identity?
              </a>
            </p>
            <p>
              This one-time process will take <strong>5 - 10 minutes</strong> to
              complete.
            </p>
            {[idme.policy, logingov.policy].includes(signInMethod) ? (
              <div data-testid="verify-button">
                {' '}
                <VerifyButton
                  {...selectCSP(signInMethod)}
                  useOAuth={useOAuth}
                />{' '}
              </div>
            ) : (
              <div data-testid="verify-button-group">
                <VerifyButton
                  {...selectCSP(logingov.policy)}
                  useOAuth={useOAuth}
                />
                <VerifyButton {...selectCSP(idme.policy)} useOAuth={useOAuth} />
              </div>
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
};

const mapStateToProps = state => ({
  loading: isProfileLoading(state),
  profile: selectProfile(state),
  useOAuth: isAuthenticatedWithOAuth(state),
});

export default connect(mapStateToProps)(VerifyApp);

VerifyApp.propTypes = {
  loading: PropTypes.bool.isRequired,
  profile: PropTypes.object.isRequired,
  useOAuth: PropTypes.bool,
};

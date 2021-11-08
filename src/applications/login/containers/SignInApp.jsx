import React from 'react';
import { connect } from 'react-redux';
import appendQuery from 'append-query';
import 'url-search-params-polyfill';

import AutoSSO from 'platform/site-wide/user-nav/containers/AutoSSO';
import SignInButtons from '../components/SignInButtons';
import FedWarning from '../components/FedWarning';
import LogoutAlert from '../components/LogoutAlert';

import ExternalServicesError from 'platform/monitoring/external-services/ExternalServicesError';
import SubmitSignInForm from 'platform/static-data/SubmitSignInForm';
import {
  isAuthenticatedWithSSOe,
  loginGov,
} from 'platform/user/authentication/selectors';
import { selectProfile, isProfileLoading } from 'platform/user/selectors';

import downtimeBanners from '../utilities/downtimeBanners';

class SignInPage extends React.Component {
  state = {
    globalDowntime: false,
  };

  componentDidUpdate() {
    const searchParams = new URLSearchParams(window.location.search);
    const application = searchParams.get('application');
    if (
      this.props.isAuthenticatedWithSSOe &&
      !this.props.profile.verified &&
      application === 'myvahealth'
    ) {
      this.props.router.push(
        appendQuery('/verify', window.location.search.slice(1)),
      );
    }
  }

  setGlobalDowntimeState = () => {
    this.setState({ globalDowntime: true });
  };

  downtimeBanner = (
    { dependencies, headline, status, message },
    globalDowntime,
    index,
  ) => (
    <ExternalServicesError
      dependencies={dependencies}
      onRender={globalDowntime ? this.setGlobalDowntimeState : null}
      key={index}
    >
      <div className="downtime-notification row">
        <div className="columns small-12">
          <div className="form-warning-banner">
            <va-alert headline={headline} visible status={status}>
              {message}
            </va-alert>
            <br />
          </div>
        </div>
      </div>
    </ExternalServicesError>
  );

  render() {
    const { globalDowntime } = this.state;
    const { query } = this.props.location;
    const { loginGovEnabled } = this.props;
    const loggedOut = query.auth === 'logged_out';

    return (
      <>
        <AutoSSO />
        <div className="row">
          {loggedOut && <LogoutAlert />}
          <div className="columns small-12">
            <h1 className="vads-u-margin-top--2 medium-screen:vads-u-margin-bottom--2">
              Sign in
            </h1>
          </div>
        </div>
        {downtimeBanners.map((props, index) =>
          this.downtimeBanner(props, globalDowntime, index),
        )}
        <div className="row">
          <div className="columns small-12 medium-6">
            <SignInButtons
              isDisabled={globalDowntime}
              loginGovEnabled={loginGovEnabled}
            />
          </div>
        </div>
        <div className="row">
          <div className="columns small-12">
            <div className="help-info">
              <h2 className="vads-u-margin-top--0">
                Having trouble signing in?
              </h2>
              <p>
                Get answers to common questions about{' '}
                <a href="/resources/signing-in-to-vagov/" target="_blank">
                  signing in
                </a>{' '}
                and{' '}
                <a
                  href="/resources/verifying-your-identity-on-vagov/"
                  target="_blank"
                >
                  verifying your identity
                </a>
                .
              </p>
              <p>
                <SubmitSignInForm startSentence /> We're here 24/7.
              </p>
            </div>
            <FedWarning />
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = state => ({
  profile: selectProfile(state),
  profileLoading: isProfileLoading(state),
  loginGovEnabled: loginGov(state),
  isAuthenticatedWithSSOe: isAuthenticatedWithSSOe(state),
});

export default connect(mapStateToProps)(SignInPage);

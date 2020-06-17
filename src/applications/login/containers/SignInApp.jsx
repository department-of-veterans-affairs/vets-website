import React from 'react';

import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

import ExternalServicesError from 'platform/monitoring/external-services/ExternalServicesError';
import SubmitSignInForm from 'platform/static-data/SubmitSignInForm';
import environment from 'platform/utilities/environment';

import SignInButtons from '../components/SignInButtons';
import SignInDescription from '../components/SignInDescription';
import FedWarning from '../components/FedWarning';
import LogoutAlert from '../components/LogoutAlert';
import downtimeBanners from '../utilities/downtimeBanners';

const vaGovFullDomain = environment.BASE_URL;

class SignInPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      globalDowntime: false,
    };
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
            <AlertBox headline={headline} isVisible status={status}>
              {message}
            </AlertBox>
            <br />
          </div>
        </div>
      </div>
    </ExternalServicesError>
  );

  render() {
    const { globalDowntime } = this.state;
    const { query } = this.props.location;
    const loggedOut = query.auth === 'logged_out';
    const application = query.application;
    const redirect = query.to;

    return (
      <main className="login">
        <div className="container">
          <div className="row">
            {loggedOut && <LogoutAlert />}
            <div className="columns small-12">
              <h1 className="medium-screen:vads-u-margin-top--1 medium-screen:vads-u-margin-bottom--5">
                Sign in
              </h1>
            </div>
          </div>
          <div className="row medium-screen:vads-u-display--none mobile-explanation">
            <div className="columns small-12">
              <h2>
                One sign in. A lifetime of benefits and services at your
                fingertips.
              </h2>
            </div>
          </div>
          {downtimeBanners.map((props, index) =>
            this.downtimeBanner(props, globalDowntime, index),
          )}
          <div className="row">
            <div className="usa-width-one-half">
              <div className="signin-actions-container">
                <div className="top-banner">
                  <div>
                    <img
                      alt="ID.me"
                      src={`${vaGovFullDomain}/img/signin/lock-icon.svg`}
                    />{' '}
                    Secured & powered by{' '}
                    <img
                      alt="ID.me"
                      src={`${vaGovFullDomain}/img/signin/idme-icon-dark.svg`}
                    />
                  </div>
                </div>
                <div className="signin-actions">
                  <h5>Sign in with an existing account</h5>
                  <SignInButtons
                    isDisabled={globalDowntime}
                    application={application}
                    redirect={redirect}
                  />
                </div>
              </div>
            </div>
            <SignInDescription />
          </div>
          <div className="row">
            <div className="columns small-12">
              <div className="help-info">
                <h4>Having trouble signing in?</h4>
                <p>
                  <a href="/sign-in-faq/" target="_blank">
                    Get answers to Frequently Asked Questions
                  </a>
                </p>
                <p>
                  <SubmitSignInForm startSentence />
                </p>
              </div>
              <hr />
              <FedWarning />
            </div>
          </div>
        </div>
      </main>
    );
  }
}

export default SignInPage;

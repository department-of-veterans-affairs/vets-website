import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
import Modal from '@department-of-veterans-affairs/component-library/Modal';

/*
  Task list
  1. Update feature flags for Login.gov
    a. [x] Ensure it is added to backend flipper features.yml
    b. [x] Add it to the featureFlagNames.js
    c. [x] Add it to auth/selectors.js
  
  2. Update SignInModal & /sign-in page
    a. [x] Responsiveness
    b. [x] Updated designs from prototype
    c. [x] Use bigger buttons
    d. [x] Add Login.gov button and update utilities to add CSP

  3. Accessibility testing
    a. [x] 508C testing
    b. [x] aXe accessibility testing
    c. Magnification testing
    d. Voice-over testing
    e. Send to VSA Public sites for confirmation

  4. Update unit & integration testing
    a. Update unit tests
    b. Verify flipper feature works as intended

*/

import Telephone, {
  CONTACTS,
  PATTERNS,
} from '@department-of-veterans-affairs/component-library/Telephone';

// import { getCurrentGlobalDowntime } from 'platform/monitoring/DowntimeNotification/util/helpers';
import ExternalServicesError from 'platform/monitoring/external-services/ExternalServicesError';
import { EXTERNAL_SERVICES } from 'platform/monitoring/external-services/config';
import recordEvent from 'platform/monitoring/record-event';
import { ssoe, loginGov } from 'platform/user/authentication/selectors';
import { login, signup } from 'platform/user/authentication/utilities';
import { formatDowntime } from 'platform/utilities/date';
import environment from 'platform/utilities/environment';

const vaGovFullDomain = environment.BASE_URL;
const logoSrc = `${vaGovFullDomain}/img/design/logo/va-logo.png`;

export class SignInModal extends React.Component {
  state = { globalDowntime: null };

  /*
  componentDidMount() {
    getCurrentGlobalDowntime().then(globalDowntime => {
      this.setState(globalDowntime);
    });
  }
  */

  componentDidUpdate(prevProps) {
    if (!prevProps.visible && this.props.visible) {
      recordEvent({ event: 'login-modal-opened' });
    } else if (prevProps.visible && !this.props.visible) {
      recordEvent({ event: 'login-modal-closed' });
    }
  }

  authVersion() {
    return this.props.useSSOe ? 'v1' : 'v0';
  }

  loginHandler = loginType => () => {
    recordEvent({ event: `login-attempted-${loginType}` });
    login(loginType, this.authVersion());
  };

  signupHandler = provider => () => {
    signup({ version: 'v1', queryParams: { csp: provider } });
  };

  downtimeBanner = (dependencies, headline, status, message, onRender) => (
    <ExternalServicesError dependencies={dependencies} onRender={onRender}>
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

  renderGlobalDowntime = () => (
    <div className="vads-u-margin-bottom--4">
      <AlertBox
        headline="You may have trouble signing in or using some tools or services"
        status="warning"
        isVisible
      >
        <p>
          We’re doing some work on VA.gov right now. We hope to finish our work
          by {formatDowntime(this.state.globalDowntime.endTIme)}. If you have
          trouble signing in or using any tool or services, check back after
          then.
        </p>
      </AlertBox>
    </div>
  );

  renderDowntimeBanners = () => {
    if (this.state.globalDowntime) {
      return this.renderGlobalDowntime();
    }

    return (
      <>
        {this.downtimeBanner(
          [EXTERNAL_SERVICES.idme, EXTERNAL_SERVICES.ssoe],
          'Our sign in process isn’t working right now',
          'error',
          'We’re sorry. We’re working to fix some problems with our sign in process. If you’d like to sign in to VA.gov, please check back later.',
        )}
        {this.downtimeBanner(
          [EXTERNAL_SERVICES.dslogon],
          'You may have trouble signing in with DS Logon',
          'warning',
          <>
            <p>
              We’re sorry. We’re working to fix some problems with our DS Logon
              sign in process. You can sign in to VA.gov with an existing ID.me
              account or you can create an account and verify your identity
              through ID.me.
            </p>
            <p>
              <a href="/resources/signing-in-to-vagov/">
                Learn how to create an account through ID.me.
              </a>
            </p>
            <p>
              If you continue to have trouble, please call the DS Logon help
              desk at <a href="tel:+18005389552">(800) 538-9552</a>.
            </p>
          </>,
        )}
        {this.downtimeBanner(
          [EXTERNAL_SERVICES.mhv],
          'You may have trouble signing in with My HealtheVet',
          'warning',
          'We’re sorry. We’re working to fix some problems with our My HealtheVet sign in process. If you’d like to sign in to VA.gov with your My HealtheVet username and password, please check back later.',
        )}
        {this.downtimeBanner(
          [EXTERNAL_SERVICES.mvi],
          'You may have trouble signing in or using some tools or services',
          'warning',
          'We’re sorry. We’re working to fix a problem that affects some parts of our site. If you have trouble signing in or using any tools or services, please check back soon.',
        )}
      </>
    );
  };

  renderModalContent = ({ globalDowntime }) => (
    <section className="login">
      <div className="row">
        <div className="columns">
          <div className="logo">
            <a href="/">
              <img alt="VA.gov" className="va-header-logo" src={logoSrc} />
            </a>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row">
          <div className="columns small-12">
            <h1>Sign in</h1>
          </div>
        </div>
        {/* <div className="row medium-screen:vads-u-display--none mobile-explanation">
          <div className="columns small-12">
            <h2 className="usa-font-lead medium-screen:vads-u-margin-top--0">
              One site. A lifetime of benefits and services at your fingertips.
            </h2>
          </div>
        </div> */}
        {this.renderDowntimeBanners()}
        <div>
          <div className="usa-width-one-half">
            <div className="signin-actions-container">
              <div className="signin-actions">
                <h2 className="vads-u-font-size--sm vads-u-margin-top--0">
                  Sign in with an existing account
                </h2>
                <div>
                  {this.props.useLoginGov && (
                    <button
                      disabled={globalDowntime}
                      type="button"
                      className="usa-button-primary default"
                      onClick={this.loginHandler('logingov')}
                    >
                      Sign in with
                      <img
                        alt="Login.gov"
                        src={`${vaGovFullDomain}/img/signin/login-gov-logo-rev.svg`}
                      />
                    </button>
                  )}
                  <button
                    disabled={globalDowntime}
                    type="button"
                    className="usa-button-primary default"
                    onClick={this.loginHandler('idme')}
                  >
                    Sign in with
                    <span className="sr-only">ID.me</span>
                    <img
                      alt="ID.me"
                      src={`${vaGovFullDomain}/img/signin/idme-icon-white.svg`}
                    />
                  </button>
                  <button
                    disabled={globalDowntime}
                    type="button"
                    className="usa-button-primary default"
                    onClick={this.loginHandler('dslogon')}
                  >
                    Sign in with
                    <img
                      alt="DS Logon"
                      src={`${vaGovFullDomain}/img/signin/dslogon-icon.svg`}
                    />
                    DS Logon
                  </button>
                  <button
                    disabled={globalDowntime}
                    type="button"
                    className="usa-button-primary default"
                    onClick={this.loginHandler('mhv')}
                  >
                    Sign in with
                    <img
                      alt="My HealtheVet"
                      src={`${vaGovFullDomain}/img/signin/mhv-logo-white.svg`}
                    />
                  </button>
                  <span className="sidelines">OR</span>
                  <div className="alternate-signin">
                    <h2 className="vads-u-font-size--sm vads-u-margin-top--0">
                      Don't have those accounts?
                    </h2>
                    {this.props.useLoginGov && (
                      <button
                        disabled={globalDowntime}
                        type="button"
                        className="usa-button usa-button-secondary create-account"
                        onClick={this.signupHandler('logingov')}
                      >
                        Create an account with
                        <span className="sr-only">Login.gov</span>
                        <img
                          alt="Login.gov"
                          src={`${vaGovFullDomain}/img/signin/login-gov-logo.svg`}
                        />
                      </button>
                    )}
                    <button
                      disabled={globalDowntime}
                      type="button"
                      className="usa-button usa-button-secondary create-account"
                      onClick={this.signupHandler('idme')}
                    >
                      Create an account with
                      <span className="sr-only">ID.me</span>
                      <img
                        alt="ID.me"
                        src={`${vaGovFullDomain}/img/signin/idme-icon-dark.svg`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="usa-width-one-half">
            <div className="explanation-content">
              <div className="vads-u-display--block">
                <h2 className="usa-font-lead medium-screen:vads-u-margin-top--0">
                  One site. A lifetime of benefits and services at your
                  fingertips.
                </h2>
              </div>
              <p>
                You spoke. We listened. VA.gov is the direct result of what you
                said you wanted most—one easy-to-use place to:
              </p>
              <ul>
                <li>Check your disability claim and appeal status</li>
                <li>
                  Find out how much money you have left to pay for school or
                  training
                </li>
                <li>
                  Refill your prescriptions and communicate with your health
                  care team
                </li>
                <li>...and more</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="columns small-12">
            <div className="help-info">
              <h2 className="vads-u-font-size--md">
                Having trouble signing in?
              </h2>
              <p>
                Get answers to common questions about{' '}
                <a
                  href="/resources/signing-in-to-vagov/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  signing in
                </a>{' '}
                and{' '}
                <a
                  href="/resources/verifying-your-identity-on-vagov/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  verifying your identity
                </a>
                .
              </p>
              <p>
                If you need more help, call our MyVA411 main information line at{' '}
                <Telephone contact={CONTACTS.HELP_DESK} />, select 0 (TTY:{' '}
                <Telephone
                  contact={CONTACTS[711]}
                  pattern={PATTERNS['3_DIGIT']}
                />
                ).
              </p>
            </div>
            <hr />
            <div className="fed-warning">
              <p>
                When you sign in to VA.gov, you’re using a United States federal
                government information system.
              </p>
              <p>
                By signing in, you agree to only use information you have legal
                authority to view and use. You also agree to let us monitor and
                record your activity on the system and share this information
                with auditors or law enforcement officials.
              </p>
              <p>
                By signing in, you confirm that you understand the following:
              </p>
              <p>
                Unauthorized use of this system is prohibited and may result in
                criminal, civil, or administrative penalties. Unauthorized use
                includes gaining unauthorized data access, changing data,
                harming the system or its data, or misusing the system. We can
                suspend or block your access to this system if we suspect any
                unauthorized use.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  render() {
    return (
      <Modal
        cssClass="va-modal-large"
        visible={this.props.visible}
        focusSelector="button"
        onClose={this.props.onClose}
        id="signin-signup-modal"
      >
        {this.renderModalContent(this.state)}
      </Modal>
    );
  }
}

SignInModal.propTypes = {
  onClose: PropTypes.func,
  visible: PropTypes.bool,
};

function mapStateToProps(state) {
  return {
    useSSOe: ssoe(state),
    useLoginGov: loginGov(state),
  };
}

export default connect(mapStateToProps)(SignInModal);

import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import Modal from '@department-of-veterans-affairs/component-library/Modal';

import FedWarning from 'applications/login/components/FedWarning';
import SubmitSignInForm from 'platform/static-data/SubmitSignInForm';

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

  loginHandler = loginType => () => {
    recordEvent({ event: `login-attempted-${loginType}` });
    login(loginType, 'v1');
  };

  signupHandler = provider => () => {
    signup({ version: 'v1', queryParams: { csp: provider } });
  };

  downtimeBanner = (dependencies, headline, status, message, onRender) => (
    <ExternalServicesError dependencies={dependencies} onRender={onRender}>
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

  renderGlobalDowntime = () => (
    <div className="vads-u-margin-bottom--4">
      <va-alert
        headline="You may have trouble signing in or using some tools or services"
        status="warning"
        visible
      >
        <p>
          We’re doing some work on VA.gov right now. We hope to finish our work
          by {formatDowntime(this.state.globalDowntime.endTIme)}. If you have
          trouble signing in or using any tool or services, check back after
          then.
        </p>
      </va-alert>
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
            <h1 className="vads-u-margin-top--2 medium-screen:vads-u-margin-top--1 medium-screen:vads-u-margin-bottom--2">
              Sign in
            </h1>
          </div>
        </div>
        {this.renderDowntimeBanners()}
        <div className="row">
          <div className="columns small-12 medium-6">
            <div>
              {this.props.loginGovEnabled && (
                <button
                  disabled={globalDowntime}
                  type="link"
                  aria-label="Sign in with DS Logon"
                  className="usa-button usa-button-big logingov-button vads-u-margin-y--1p5"
                  onClick={this.loginHandler('logingov')}
                >
                  <img
                    alt="Sign in with Login.gov"
                    src={`${vaGovFullDomain}/img/signin/logingov-icon-white.svg`}
                  />
                </button>
              )}
              <button
                disabled={globalDowntime}
                type="link"
                aria-label="Sign in with DS Logon"
                className="usa-button usa-button-big idme-button vads-u-margin-y--1p5"
                onClick={this.loginHandler('idme')}
              >
                <img
                  alt="Sign in with ID.me"
                  src={`${vaGovFullDomain}/img/signin/idme-icon-white.svg`}
                />
              </button>
              <button
                disabled={globalDowntime}
                type="link"
                aria-label="Sign in with DS Logon"
                className="usa-button usa-button-big dslogon-button vads-u-margin-y--1p5"
                onClick={this.loginHandler('dslogon')}
              >
                DS Logon
              </button>
              <button
                disabled={globalDowntime}
                type="link"
                aria-label="Sign in with My HealtheVet"
                className="usa-button usa-button-big mhv-button vads-u-margin-y--1p5"
                onClick={this.loginHandler('mhv')}
              >
                My HealtheVet
              </button>
              <div className="alternate-signin">
                <h2 className="vads-u-margin-top--3">Or create an account</h2>
                <div className="vads-u-display--flex vads-u-flex-direction--column">
                  {this.props.loginGovEnabled && (
                    <a
                      role="link"
                      tabIndex="0"
                      aria-label="Create an account with Login.gov. Navigates to Login.gov website"
                      disabled={globalDowntime}
                      className="vads-c-action-link--blue vads-u-border-top--1px vads-u-padding-bottom--2"
                      onClick={this.signupHandler('logingov')}
                    >
                      Create an account with Login.gov
                    </a>
                  )}
                  <a
                    role="link"
                    tabIndex="0"
                    aria-label="Create an account with ID.me. Navigates to ID.me website"
                    disabled={globalDowntime}
                    className="vads-c-action-link--blue vads-u-border-top--1px vads-u-padding-bottom--2 vads-u-border-bottom--1px"
                    onClick={this.signupHandler('idme')}
                  >
                    Create an account with ID.me
                  </a>
                </div>
                {this.props.loginGovEnabled && (
                  <a
                    className="vads-u-display--block vads-u-margin-top--2"
                    href="#"
                    target="_blank"
                  >
                    Learn more about choosing an account
                  </a>
                )}
              </div>
            </div>
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
    loginGovEnabled: loginGov(state),
  };
}

export default connect(mapStateToProps)(SignInModal);

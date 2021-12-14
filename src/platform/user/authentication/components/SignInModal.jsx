import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import Modal from '@department-of-veterans-affairs/component-library/Modal';

import FedWarning from 'platform/user/authentication/components/FedWarning';
import LoginContainer from 'platform/user/authentication/components/LoginContainer';
import SubmitSignInForm from 'platform/static-data/SubmitSignInForm';

// import { getCurrentGlobalDowntime } from 'platform/monitoring/DowntimeNotification/util/helpers';
import ExternalServicesError from 'platform/monitoring/external-services/ExternalServicesError';
import { EXTERNAL_SERVICES } from 'platform/monitoring/external-services/config';
import recordEvent from 'platform/monitoring/record-event';
import {
  ssoe,
  loginGov,
  loginGovCreateAccount,
} from 'platform/user/authentication/selectors';
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

  loginHandler = loginType => () => {
    recordEvent({ event: `login-attempted-${loginType}` });
    login({ policy: loginType });
  };

  signupHandler = () => {
    signup();
  };

  componentDidUpdate(prevProps) {
    if (!prevProps.visible && this.props.visible) {
      recordEvent({ event: 'login-modal-opened' });
    } else if (prevProps.visible && !this.props.visible) {
      recordEvent({ event: 'login-modal-closed' });
    }
  }

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
            <img alt="VA.gov" className="va-header-logo" src={logoSrc} />
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row">
          <div className="columns small-12">
            <h1 className="vads-u-margin-top--2 vads-u-color--gray-dark medium-screen:vads-u-margin-top--1 medium-screen:vads-u-margin-bottom--2">
              Sign in
            </h1>
          </div>
        </div>
        {this.renderDowntimeBanners()}
        <div className="row">
          <LoginContainer
            loginGovEnabled={this.props.loginGovEnabled}
            loginGovCreateAccountEnabled={
              this.props.loginGovCreateAccountEnabled
            }
            isDisabled={globalDowntime}
          />
        </div>
        <div className="row">
          <div className="columns small-12">
            <div className="help-info vads-u-color--gray-dark">
              <h2 className="vads-u-margin-top--0">
                Having trouble signing in?
              </h2>
              <p className="vads-u-font-size--base">
                Get answers to common questions about{' '}
                <a
                  href="/resources/signing-in-to-vagov/"
                  target="_blank"
                  aria-label="Questions about signing in to VA.gov. (Opens a new window)"
                >
                  signing in
                </a>{' '}
                and{' '}
                <a
                  href="/resources/verifying-your-identity-on-vagov/"
                  target="_blank"
                  aria-label="Verifying your identity on VA.gov. (Opens a new window)"
                >
                  verifying your identity
                </a>
                .
              </p>
              <p className="vads-u-font-size--base">
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
        cssClass="va-modal-large new-modal-design"
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
    loginGovCreateAccountEnabled: loginGovCreateAccount(state),
  };
}

export default connect(mapStateToProps)(SignInModal);

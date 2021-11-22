import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import Modal from '@department-of-veterans-affairs/component-library/Modal';

import FedWarning from 'platform/user/authentication/components/FedWarning';
import NewDesignButtons from 'platform/user/authentication/components/NewDesignButtons';
import OriginalDesignButtons from 'platform/user/authentication/components/OriginalDesignButtons';
import SubmitSignInForm from 'platform/static-data/SubmitSignInForm';
import SignInDescription from 'platform/user/authentication/components/SignInDescription';

// import { getCurrentGlobalDowntime } from 'platform/monitoring/DowntimeNotification/util/helpers';
import ExternalServicesError from 'platform/monitoring/external-services/ExternalServicesError';
import { EXTERNAL_SERVICES } from 'platform/monitoring/external-services/config';
import recordEvent from 'platform/monitoring/record-event';
import {
  ssoe,
  loginGov,
  loginGovCreateAccount,
  loginOldDesign,
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

  renderOriginalModal = ({ globalDowntime }) => {
    return (
      <div>
        <div className="usa-width-one-half">
          <div className="signin-actions-container">
            <div className="top-banner">
              <div>
                <img
                  aria-hidden="true"
                  role="presentation"
                  alt="ID.me"
                  src={`${vaGovFullDomain}/img/signin/lock-icon.svg`}
                />{' '}
                Secured & powered by{' '}
                <img
                  aria-hidden="true"
                  role="presentation"
                  alt="ID.me"
                  src={`${vaGovFullDomain}/img/signin/idme-icon-dark.svg`}
                />
              </div>
            </div>
            <div className="signin-actions">
              <h2 className="vads-u-font-size--sm vads-u-margin-top--0">
                Sign in with an existing account
              </h2>
              <div>
                <OriginalDesignButtons isDisabled={globalDowntime} />
              </div>
            </div>
          </div>
        </div>
        <SignInDescription />
      </div>
    );
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
            <h1
              className={`${!this.props.oldDesignEnabled &&
                'vads-u-margin-top--2 medium-screen:vads-u-margin-top--1 medium-screen:vads-u-margin-bottom--2'}`}
            >
              Sign in
            </h1>
          </div>
        </div>
        {this.props.oldDesignEnabled ? (
          <div className="row medium-screen:vads-u-display--none mobile-explanation">
            <div className="columns small-12">
              <h2>
                One site. A lifetime of benefits and services at your
                fingertips.
              </h2>
            </div>
          </div>
        ) : null}
        {this.renderDowntimeBanners()}
        {this.props.oldDesignEnabled ? (
          this.renderOriginalModal({
            globalDowntime,
          })
        ) : (
          <div className="row">
            <NewDesignButtons
              loginGovEnabled={this.props.loginGovEnabled}
              loginGovCreateAccountEnabled={
                this.props.loginGovCreateAccountEnabled
              }
              isDisabled={globalDowntime}
            />
          </div>
        )}
        <div className="row">
          <div className="columns small-12">
            <div className="help-info">
              <h2
                className={`${
                  !this.props.oldDesignEnabled
                    ? 'vads-u-margin-top--0'
                    : 'vads-u-font-size--md'
                }`}
              >
                Having trouble signing in?
              </h2>
              <p>
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
              <p>
                <SubmitSignInForm startSentence />{' '}
                {!this.props.oldDesignEnabled && ` We're here 24/7.`}
              </p>
            </div>
            <FedWarning oldDesignEnabled={this.props.oldDesignEnabled} />
          </div>
        </div>
      </div>
    </section>
  );

  render() {
    return (
      <Modal
        cssClass={`va-modal-large ${
          !this.props.oldDesignEnabled ? 'new-modal-design' : ''
        }`}
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
    oldDesignEnabled: loginOldDesign(state),
  };
}

export default connect(mapStateToProps)(SignInModal);

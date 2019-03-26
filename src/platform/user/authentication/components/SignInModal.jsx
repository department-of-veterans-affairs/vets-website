import PropTypes from 'prop-types';
import React from 'react';

import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import Modal from '@department-of-veterans-affairs/formation-react/Modal';
import SubmitSignInForm from '../../../brand-consolidation/components/SubmitSignInForm';

import environment from '../../../utilities/environment';
import recordEvent from '../../../monitoring/record-event';
import { login, signup } from '../../../user/authentication/utilities';
import { externalServices } from '../../../../platform/monitoring/DowntimeNotification';
import DowntimeBanner from '../../../../platform/monitoring/DowntimeNotification/components/Banner';
import siteName from '../../../brand-consolidation/site-name';

const loginHandler = loginType => () => {
  recordEvent({ event: `login-attempted-${loginType}` });
  login(loginType);
};

const handleDsLogon = loginHandler('dslogon');
const handleMhv = loginHandler('mhv');
const handleIdMe = loginHandler('idme');

const vaGovFullDomain = environment.BASE_URL;
const logoSrc = `${vaGovFullDomain}/img/design/logo/va-logo.png`;

class SignInModal extends React.Component {
  componentDidUpdate(prevProps) {
    if (!prevProps.visible && this.props.visible) {
      recordEvent({ event: 'login-modal-opened' });
    } else if (prevProps.visible && !this.props.visible) {
      recordEvent({ event: 'login-modal-closed' });
    }
  }

  downtimeBanner = (dependencies, headline, status, message) => (
    <DowntimeBanner dependencies={dependencies}>
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
    </DowntimeBanner>
  );

  renderModalContent = () => (
    <main className="login">
      <div className="row">
        <div className="columns">
          <div className="logo">
            <a href="/">
              <img alt={siteName} className="va-header-logo" src={logoSrc} />
            </a>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row">
          <div className="columns small-12">
            <h1>Sign in to {siteName}</h1>
          </div>
        </div>
        <div className="row medium-screen:vads-u-display--none mobile-explanation">
          <div className="columns small-12">
            <h2>Don't have those accounts?</h2>
          </div>
        </div>
        {this.downtimeBanner(
          [externalServices.idme],
          "Our sign in process isn't working right now",
          'error',
          "We're sorry. We're working to fix some problems with our sign in process. If you'd like to sign in to VA.gov, please check back later.",
        )}
        {this.downtimeBanner(
          [externalServices.dslogon],
          'You may have trouble signing in with DS Logon',
          'warning',
          "We're sorry. We're working to fix some problems with our DS Logon sign in process. If you'd like to sign in to VA.gov with your DS Logon account, please check back later.",
        )}
        {this.downtimeBanner(
          [externalServices.mhv],
          'You may have trouble signing in with My HealtheVet',
          'warning',
          "We’re sorry. We’re working to fix some problems with our My HealtheVet in process. If you'd like to sign in to VA.gov with your My HealtheVet account, please check back later.",
        )}
        {this.downtimeBanner(
          [externalServices.mvi],
          'You may have trouble signing in or using some tools or services',
          'warning',
          "We're sorry. We're working to fix a problem that affects some parts of our site. If you have trouble signing in or using any tools or srevices, please check back soon.",
        )}
        <div>
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
                <div>
                  <button className="dslogon" onClick={handleDsLogon}>
                    <img
                      alt="DS Logon"
                      src={`${vaGovFullDomain}/img/signin/dslogon-icon.svg`}
                    />
                    <strong> Sign in with DS Logon</strong>
                  </button>
                  <button className="mhv" onClick={handleMhv}>
                    <img
                      alt="My HealtheVet"
                      src={`${vaGovFullDomain}/img/signin/mhv-icon.svg`}
                    />
                    <strong> Sign in with My HealtheVet</strong>
                  </button>
                  <button
                    className="usa-button-primary va-button-primary"
                    onClick={handleIdMe}
                  >
                    <img
                      alt="ID.me"
                      src={`${vaGovFullDomain}/img/signin/idme-icon-white.svg`}
                    />
                    <strong> Sign in with ID.me</strong>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="usa-width-one-half">
            <div className="alternate-signin">
              <h5>Don't have those accounts?</h5>
              <button
                className="idme-create usa-button usa-button-secondary"
                onClick={signup}
              >
                <img
                  alt="ID.me"
                  src={`${vaGovFullDomain}/img/signin/idme-icon-dark.svg`}
                />
                <strong> Create an ID.me account</strong>
              </button>
              <p>Use your email, Google, or Facebook</p>
              <p>
                <a href="/sign-in-faq/#what-is-idme" target="_blank">
                  Learn more about {siteName}
                  's partnership with ID.me
                </a>
              </p>
            </div>
          </div>
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
            <div className="fed-warning">
              <p>
                When you sign in to {siteName}, you’re using a United States
                federal government information system.
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
    </main>
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
        {this.renderModalContent()}
      </Modal>
    );
  }
}

SignInModal.propTypes = {
  onClose: PropTypes.func,
  visible: PropTypes.bool,
};

export default SignInModal;

import PropTypes from 'prop-types';
import React from 'react';

import AlertBox from '@department-of-veterans-affairs/formation/AlertBox';
import Modal from '@department-of-veterans-affairs/formation/Modal';
import CallHelpDesk from '../../../brand-consolidation/components/CallHelpDesk';

import isBrandConsolidationEnabled from '../../../brand-consolidation/feature-flag';
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

const logoSrc = `/img/design/logo/${
  isBrandConsolidationEnabled() ? 'va-logo.png' : 'logo-alt.png'
}`;
const faqHref = isBrandConsolidationEnabled() ? '/sign-in-faq/' : '/faq/';

class SignInModal extends React.Component {
  componentDidUpdate(prevProps) {
    if (!prevProps.visible && this.props.visible) {
      recordEvent({ event: 'login-modal-opened' });
    }
  }

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
        <div className="row hide-for-medium-up mobile-explanation">
          <div className="columns small-12">
            <h2>
              One site. A lifetime of benefits and services at your fingertips.
            </h2>
          </div>
        </div>
        <DowntimeBanner dependencies={[externalServices.dslogon]}>
          <div className="downtime-notification row">
            <div className="columns small-12">
              <div className="form-warning-banner">
                <AlertBox
                  headline={`Some ${siteName} tools and features may not be working as expected`}
                  isVisible
                  status="warning"
                >
                  We’re sorry. We’re working to fix some problems with DS Logon
                  right now. Please check back later or{' '}
                  <CallHelpDesk>
                    call the {siteName} Help Desk for more information at
                    1-855-574-7286, TTY: 1-800-877-8339.
                  </CallHelpDesk>
                </AlertBox>
                <br />
              </div>
            </div>
          </div>
        </DowntimeBanner>
        <div className="row">
          <div className="columns usa-width-one-half medium-6">
            <div className="signin-actions-container">
              <div className="top-banner">
                <div>
                  <img alt="ID.me" src="/img/signin/lock-icon.svg" /> Secured &
                  powered by{' '}
                  <img alt="ID.me" src="/img/signin/idme-icon-dark.svg" />
                </div>
              </div>
              <div className="signin-actions">
                <h5>Sign in with an existing account</h5>
                <div>
                  <button className="dslogon" onClick={handleDsLogon}>
                    <img alt="DS Logon" src="/img/signin/dslogon-icon.svg" />
                    <strong> Sign in with DS Logon</strong>
                  </button>
                  <button className="mhv" onClick={handleMhv}>
                    <img alt="My HealtheVet" src="/img/signin/mhv-icon.svg" />
                    <strong> Sign in with My HealtheVet</strong>
                  </button>
                  <button
                    className="usa-button-primary va-button-primary"
                    onClick={handleIdMe}
                  >
                    <img alt="ID.me" src="/img/signin/idme-icon-white.svg" />
                    <strong> Sign in with ID.me</strong>
                  </button>
                  <span className="sidelines">OR</span>
                  <div className="alternate-signin">
                    <h5>Don't have those accounts?</h5>
                    <button
                      className="idme-create usa-button usa-button-secondary"
                      onClick={signup}
                    >
                      <img alt="ID.me" src="/img/signin/idme-icon-dark.svg" />
                      <strong> Create an ID.me account</strong>
                    </button>
                    <p>Use your email, Google, or Facebook</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="columns usa-width-one-half medium-6">
            <div className="explanation-content">
              <div className="hide-for-small usa-font-lead">
                One site. A lifetime of benefits and services at your
                fingertips.
              </div>
              <p>
                You spoke. We listened. {siteName} is the direct result of what
                you said you wanted most—one easy-to-use place to:
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
              <p>
                <strong>A secure account powered by ID.me</strong>
                <br />
                ID.me is our trusted technology partner in helping to keep your
                personal information safe. They specialize in digital identity
                protection and help us make sure you're you—and not someone
                pretending to be you—before we give you access to your
                information.
              </p>
              <p>
                <a href={`${faqHref}#what-is-idme`} target="_blank">
                  Learn more about ID.me
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
                <a href={faqHref} target="_blank">
                  Get answers to Frequently Asked Questions
                </a>
              </p>
              <p>
                Or{' '}
                <CallHelpDesk>
                  call the {siteName} Help Desk at{' '}
                  <a href="tel:855-574-7286">1-855-574-7286</a>, TTY:{' '}
                  <a href="tel:18008778339">1-800-877-8339</a>
                  <br />
                  We’re here Monday &#8211; Friday, 8:00 a.m. &#8211; 8:00 p.m.
                  (ET)
                </CallHelpDesk>
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
        title={`Sign in to ${siteName}`}
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

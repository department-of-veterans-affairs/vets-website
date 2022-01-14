import React from 'react';
import differenceInSeconds from 'date-fns/differenceInSeconds';

import Modal from '@department-of-veterans-affairs/component-library/Modal';

import recordEvent from 'platform/monitoring/record-event';
import { logout } from 'platform/user/authentication/utilities';
import { teardownProfileSession } from 'platform/user/profile/utilities';
import localStorage from 'platform/utilities/storage/localStorage';

const MODAL_DURATION = 30; // seconds

class SessionTimeoutModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = { countdown: null };
    this.expirationInterval = null;
  }

  componentDidUpdate() {
    if (this.props.isLoggedIn && !this.expirationInterval) {
      this.clearInterval();
      this.expirationInterval = setInterval(this.checkExpiration, 1000);
    }
  }

  componentWillUnmount() {
    this.clearInterval();
  }

  clearInterval = () => {
    clearInterval(this.expirationInterval);
    this.expirationInterval = null;
  };

  checkExpiration = () => {
    if (!this.props.isLoggedIn) {
      this.clearInterval();
      return;
    }

    const expirationDate = localStorage.getItem('sessionExpiration');
    if (!expirationDate || isNaN(new Date(expirationDate).getTime())) return;

    const countdown = differenceInSeconds(new Date(expirationDate), Date.now());
    if (countdown < 0) this.expireSession();
    else if (countdown <= MODAL_DURATION) this.setState({ countdown });
  };

  expireSession = () => {
    recordEvent({ event: 'logout-session-expired' });
    teardownProfileSession();
    window.location = '/session-expired';
  };

  extendSession = () => {
    recordEvent({ event: 'login-cta-stay-signed-in' });

    // Remove session expiration to temporarily prevent the interval from
    // overwriting countdown immediately after clearing it.
    // Expiration will reset after a successful request to extend the session.
    localStorage.removeItem('sessionExpiration');
    this.setState({ countdown: null });
    this.props.onExtendSession();
  };

  signOut = () => {
    recordEvent({ event: 'logout-cta-manual-signout' });
    logout();
  };

  render() {
    return (
      <Modal
        hideCloseButton
        id="session-timeout-modal"
        focusSelector="button"
        onClose={this.extendSession}
        status="warning"
        title="Your session will end in..."
        visible={this.state.countdown} // Display only for 30s countdown.
      >
        <div className="vads-u-text-align--center">
          <div className="vads-u-font-size--2xl">{this.state.countdown}</div>
          <div>SECONDS</div>
        </div>
        <p>
          If you need more time, please click I need more time below. Otherwise,
          we’ll sign you out of your account to protect your privacy.
        </p>
        <div className="alert-actions">
          <button className="usa-button" onClick={this.extendSession}>
            I need more time
          </button>
          <button className="va-button-link" onClick={this.signOut}>
            Sign out
          </button>
        </div>
      </Modal>
    );
  }
}

export default SessionTimeoutModal;

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import differenceInSeconds from 'date-fns/differenceInSeconds';
import recordEvent from 'platform/monitoring/record-event';
import { logout as IAMLogout } from 'platform/user/authentication/utilities';
import { refresh, logoutUrlSiS } from 'platform/utilities/oauth/utilities';
import { teardownProfileSession } from 'platform/user/profile/utilities';
import localStorage from 'platform/utilities/storage/localStorage';
import TOGGLE_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import Modal from '@department-of-veterans-affairs/component-library/Modal';

import { initializeProfile } from 'platform/user/profile/actions';
import {
  signInServiceName as signInServiceNameSelector,
  isAuthenticatedWithOAuth,
} from 'platform/user/authentication/selectors';
import { isLoggedIn } from 'platform/user/selectors';

const MODAL_DURATION = 30; // seconds

export class SessionTimeoutModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = { countdown: null };
    this.expirationInterval = null;
    this.serviceName = '';
  }

  componentDidUpdate() {
    this.serviceName = this.props.serviceName;
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
    if (!expirationDate || Number.isNaN(new Date(expirationDate).getTime()))
      return;

    const countdown = differenceInSeconds(new Date(expirationDate), Date.now());
    if (countdown < 0) this.expireSession();
    else if (countdown <= MODAL_DURATION) this.setState({ countdown });
  };

  expireSession = () => {
    recordEvent({ event: 'logout-session-expired' });
    teardownProfileSession();
    if (!this.props.authenticatedWithOAuth) {
      IAMLogout({ ial2Enforcement: this.props.ial2Enforcement });
    } else {
      window.location = logoutUrlSiS();
    }
  };

  extendSession = () => {
    recordEvent({ event: 'login-cta-stay-signed-in' });

    // Remove session expiration to temporarily prevent the interval from
    // overwriting countdown immediately after clearing it.
    // Expiration will reset after a successful request to extend the session.
    localStorage.removeItem('sessionExpiration');
    this.setState({ countdown: null });
    if (this.props.authenticatedWithOAuth) {
      refresh({ type: this.serviceName });
    } else {
      this.props.onExtendSession();
    }
  };

  signOut = () => {
    recordEvent({ event: 'logout-cta-manual-signout' });
    if (!this.props.authenticatedWithOAuth) {
      IAMLogout({ ial2Enforcement: this.props.ial2Enforcement });
    } else {
      window.location = logoutUrlSiS();
    }
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
        {/* React Modal Component used in Injected Header DO NOT MIGRATE to Modal web component */}
        <div className="vads-u-text-align--center">
          <div className="vads-u-font-size--2xl">{this.state.countdown}</div>
          <div>SECONDS</div>
        </div>
        <p>
          If you need more time, please click I need more time below. Otherwise,
          we’ll sign you out of your account to protect your privacy.
        </p>
        <div className="alert-actions">
          <button
            type="button"
            className="usa-button"
            onClick={this.extendSession}
          >
            I need more time
          </button>
          <button
            type="button"
            className="va-button-link"
            onClick={this.signOut}
          >
            Sign out
          </button>
        </div>
      </Modal>
    );
  }
}

export const mapStateToProps = state => {
  return {
    isLoggedIn: isLoggedIn(state),
    authenticatedWithOAuth: isAuthenticatedWithOAuth(state),
    serviceName:
      signInServiceNameSelector(state) || sessionStorage.getItem('ci') || '',
    ial2Enforcement:
      state.featureToggles?.[TOGGLE_NAMES.identityIal2FullEnforcement] || false,
  };
};

const mapDispatchToProps = {
  onExtendSession: initializeProfile,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SessionTimeoutModal);

SessionTimeoutModal.propTypes = {
  onExtendSession: PropTypes.func.isRequired,
  authenticatedWithOAuth: PropTypes.bool,
  ial2Enforcement: PropTypes.bool,
  isLoggedIn: PropTypes.bool,
  serviceName: PropTypes.string,
};

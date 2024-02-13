import PropTypes from 'prop-types';
import React from 'react';

import * as Sentry from '@sentry/browser';

import Modal from '@department-of-veterans-affairs/component-library/Modal';
import { LoginContainer } from 'platform/user/authentication/components';

import recordEvent from 'platform/monitoring/record-event';

export default class SignInModal extends React.Component {
  componentDidUpdate(prevProps) {
    const isOAuthEvent = this.props.useSiS ? '-oauth' : '';
    if (!prevProps.visible && this.props.visible) {
      const eventMessage = `login-modal-opened${isOAuthEvent}`;
      Sentry.withScope(scope => {
        scope.setTag('isOAuth', isOAuthEvent);
        Sentry.captureMessage(eventMessage);
      });
      recordEvent({ event: eventMessage });
    } else if (prevProps.visible && !this.props.visible) {
      const eventMessage = `login-modal-closed${isOAuthEvent}`;
      Sentry.withScope(scope => {
        scope.setTag('isOAuth', isOAuthEvent);
        Sentry.captureMessage(eventMessage);
      });
      recordEvent({ event: eventMessage });
    }
  }

  render() {
    return (
      <Modal
        cssClass="va-modal-large new-modal-design"
        visible={this.props.visible}
        focusSelector="button"
        onClose={this.props.onClose}
        id="signin-signup-modal"
      >
        <LoginContainer />
      </Modal>
    );
  }
}

SignInModal.propTypes = {
  useSiS: PropTypes.bool,
  visible: PropTypes.bool,
  onClose: PropTypes.func,
};

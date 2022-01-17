import PropTypes from 'prop-types';
import React from 'react';

import Modal from '@department-of-veterans-affairs/component-library/Modal';
import { LoginContainer } from 'platform/user/authentication/components';

import recordEvent from 'platform/monitoring/record-event';

export default class SignInModal extends React.Component {
  componentDidUpdate(prevProps) {
    if (!prevProps.visible && this.props.visible) {
      recordEvent({ event: 'login-modal-opened' });
    } else if (prevProps.visible && !this.props.visible) {
      recordEvent({ event: 'login-modal-closed' });
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
  onClose: PropTypes.func,
  visible: PropTypes.bool,
};

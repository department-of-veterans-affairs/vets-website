import PropTypes from 'prop-types';
import React from 'react';

import Modal from '@department-of-veterans-affairs/component-library/Modal';

import recordEvent from '../../monitoring/record-event';
import { APP_TYPE_DEFAULT } from '../../forms-system/src/js/constants';

class FormSignInModal extends React.Component {
  handleClose = () => {
    this.props.onClose();
    recordEvent({ event: 'no-login-finish-form' });
  };

  handleSignIn = () => {
    this.props.onClose();
    this.props.onSignIn();
    recordEvent({ event: 'login-link-restart-form' });
  };

  render() {
    const primaryButton = {
      action: this.handleClose,
      text: 'Finish applying',
    };

    const secondaryButton = {
      action: this.handleSignIn,
      text: 'Sign in and start over',
    };
    const { formConfig } = this.props;
    const appType = formConfig?.customText?.appType || APP_TYPE_DEFAULT;

    return (
      <Modal
        id="form-sign-in-modal"
        primaryButton={primaryButton}
        secondaryButton={secondaryButton}
        visible={this.props.visible}
        focusSelector="button"
        hideCloseButton
        onClose={this.props.onClose}
        status="warning"
        title="If you sign in now, you’ll lose any information you’ve filled in"
      >
        <p>
          Since you didn’t sign in before you started, we can’t save your
          in-progress {appType}.
        </p>
        <p>If you sign in now, you’ll need to start over.</p>
      </Modal>
    );
  }
}

FormSignInModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSignIn: PropTypes.func.isRequired,
  formConfig: PropTypes.shape({
    customText: PropTypes.shape({
      appType: PropTypes.string,
    }),
  }),
  visible: PropTypes.bool,
};

export default FormSignInModal;

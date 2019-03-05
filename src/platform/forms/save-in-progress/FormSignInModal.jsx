import PropTypes from 'prop-types';
import React from 'react';

import Modal from '@department-of-veterans-affairs/formation-react/Modal';

class FormSignInModal extends React.Component {
  handleSignIn = () => {
    this.props.onClose();
    this.props.onSignIn();
  };

  render() {
    const primaryButton = {
      action: this.props.onClose,
      text: 'Finish applying',
    };

    const secondaryButton = {
      action: this.handleSignIn,
      text: 'Sign in and start over',
    };

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
          in-progress application.
        </p>
        <p>If you sign in now, you’ll need to start over.</p>
      </Modal>
    );
  }
}

FormSignInModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSignIn: PropTypes.func.isRequired,
  visible: PropTypes.bool,
};

export default FormSignInModal;

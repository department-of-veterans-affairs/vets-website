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
      text: 'Sign in',
    };

    return (
      <Modal
        id="form-sign-in-modal"
        primaryButton={primaryButton}
        secondaryButton={secondaryButton}
        visible={this.props.visible}
        focusSelector="button"
        onClose={this.props.onClose}
        status="warning"
        title="We can’t save your in-progress application"
      >
        To save your work in progress, you need to be signed in to your VA.gov
        account before starting an application. If you leave this application to
        sign in now, you’ll lose any information you’ve already filled in.
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

import PropTypes from 'prop-types';
import React from 'react';

import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

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
    const { formConfig } = this.props;
    const appType = formConfig?.customText?.appType || APP_TYPE_DEFAULT;

    return (
      <VaModal
        id="form-sign-in-modal"
        primaryButtonText="Finish applying"
        secondaryButtonText="Sign in and start over"
        onPrimaryButtonClick={this.handleClose}
        onSecondaryButtonClick={this.handleSignIn}
        visible={this.props.visible}
        forcedModal
        onCloseEvent={this.props.onClose}
        status="warning"
        modalTitle="If you sign in now, you’ll lose any information you’ve filled in"
        uswds
      >
        <p>
          Since you didn’t sign in before you started, we can’t save your
          in-progress {appType}.
        </p>
        <p>If you sign in now, you’ll need to start over.</p>
      </VaModal>
    );
  }
}

FormSignInModal.propTypes = {
  formConfig: PropTypes.shape({
    customText: PropTypes.shape({
      appType: PropTypes.text,
    }),
  }),
  onClose: PropTypes.func.isRequired,
  onSignIn: PropTypes.func.isRequired,
  visible: PropTypes.bool,
};

export default FormSignInModal;

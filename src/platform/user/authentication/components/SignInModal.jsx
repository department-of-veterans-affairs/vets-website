import PropTypes from 'prop-types';
import React from 'react';

import { LoginContainer } from 'platform/user/authentication/components';

import recordEvent from 'platform/monitoring/record-event';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

export default class SignInModal extends React.Component {
  componentDidUpdate(prevProps) {
    const isOAuthEvent = this.props.useSiS ? '-oauth' : '';
    if (!prevProps.visible && this.props.visible) {
      recordEvent({ event: `login-modal-opened${isOAuthEvent}` });
    } else if (prevProps.visible && !this.props.visible) {
      recordEvent({ event: `login-modal-closed${isOAuthEvent}` });
    }
  }

  render() {
    return (
      <VaModal
        large
        visible={this.props.visible}
        initialFocusSelector="button"
        onCloseEvent={this.props.onClose}
        id="signin-signup-modal"
        uswds
      >
        <LoginContainer />
      </VaModal>
    );
  }
}

SignInModal.propTypes = {
  useSiS: PropTypes.bool,
  visible: PropTypes.bool,
  onClose: PropTypes.func,
};

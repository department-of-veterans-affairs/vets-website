import PropTypes from 'prop-types';
import React from 'react';

import { LoginContainer } from 'platform/user/authentication/components';

import recordEvent from 'platform/monitoring/record-event';

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
      <va-modal
        cssClass="va-modal-large new-modal-design"
        visible={this.props.visible}
        focusSelector="button"
        onClose={this.props.onClose}
        id="signin-signup-modal"
      >
        <LoginContainer />
      </va-modal>
    );
  }
}

SignInModal.propTypes = {
  useSiS: PropTypes.bool,
  visible: PropTypes.bool,
  onClose: PropTypes.func,
};

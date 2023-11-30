import PropTypes from 'prop-types';
import React from 'react';

import Modal from '@department-of-veterans-affairs/component-library/Modal';
import { LoginContainer } from 'platform/user/authentication/components';

import recordEvent from 'platform/monitoring/record-event';

export default class SignInModal extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.state = { suppressModal: !this.props.visible };
  // }

  componentDidUpdate(prevProps) {
    const isOAuthEvent = this.props.useSiS ? '-oauth' : '';
    if (!prevProps.visible && this.props.visible) {
      recordEvent({ event: `login-modal-opened${isOAuthEvent}` });
    } else if (prevProps.visible && !this.props.visible) {
      recordEvent({ event: `login-modal-closed${isOAuthEvent}` });
    }

    // const crisisLineModalIsOpen = document.querySelector(
    //   '#modal-crisisline.va-overlay--open',
    // );

    // if (crisisLineModalIsOpen && !this.state.suppressModal) {
    //   this.toggleModal(true);
    // } else if (!crisisLineModalIsOpen && this.state.suppressModal) {
    //   this.toggleModal(false);
    // }
  }

  // toggleModal(state) {
  //   this.setState({ suppressModal: state });
  // }

  render() {
    console.log('this.props.visible: ', this.props.visible);
    // console.log('suppressModal: ', this.state.suppressModal);
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

import React from 'react';
import PropTypes from 'prop-types';

import Modal from '@department-of-veterans-affairs/formation-react/Modal';

class PaymentInformationEditModal extends React.Component {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    isVisible: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  onClose = () => {
    this.props.onClose();
  };

  render() {
    return (
      <Modal
        title="Edit direct deposit information"
        visible={this.props.isVisible}
        onClose={this.onClose}
      >
        <h1>Edit your direct deposit</h1>
      </Modal>
    );
  }
}

export default PaymentInformationEditModal;

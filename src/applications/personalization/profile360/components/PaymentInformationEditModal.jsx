import React from 'react';
import PropTypes from 'prop-types';

import Modal from '@department-of-veterans-affairs/formation-react/Modal';

import PaymentInformationEditModalError from './PaymentInformationEditModalError';
import BankInfoForm from './BankInfoForm';

class PaymentInformationEditModal extends React.Component {
  static propTypes = {
    isEditing: PropTypes.bool.isRequired,
    isSaving: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    responseError: PropTypes.object,
  };

  state = {
    formData: {},
  };

  componentDidUpdate = prevProps => {
    if (this.props.isEditing && !prevProps.isEditing) {
      this.setState({ formData: {} });
    }
  };

  formSubmit = ({ formData }) => {
    this.props.onSubmit({
      financialInstitutionName: 'Hidden form field',
      financialInstitutionRoutingNumber: formData.routingNumber,
      accountNumber: formData.accountNumber,
      accountType: formData.accountType,
    });
  };

  render() {
    return (
      <Modal
        title="Edit your direct deposit information"
        visible={this.props.isEditing}
        onClose={this.props.onClose}
      >
        <div id="errors" role="alert" aria-atomic="true">
          {!!this.props.responseError && (
            <PaymentInformationEditModalError
              responseError={this.props.responseError}
              closeModal={this.props.onClose}
            />
          )}
        </div>
        <p className="vads-u-margin-top--1p5">
          Please provide your bank’s current routing number as well as your
          current account number and type. Then click <strong>Update</strong> to
          save your information.
        </p>
        <img
          src="/img/direct-deposit-check-guide.png"
          alt="On a personal check, find your bank's 9-digit routing number listed along the bottom-left edge, and your account number listed beside that."
        />

        <BankInfoForm
          formData={this.state.formData}
          formSubmit={this.formSubmit}
          formChange={formData => this.setState({ formData })}
          isSaving={this.props.isSaving}
          onClose={this.props.onClose}
        />
      </Modal>
    );
  }
}

export default PaymentInformationEditModal;

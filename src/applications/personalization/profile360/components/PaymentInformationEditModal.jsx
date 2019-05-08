import React from 'react';
import PropTypes from 'prop-types';

import Modal from '@department-of-veterans-affairs/formation-react/Modal';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import ErrorableTextInput from '@department-of-veterans-affairs/formation-react/ErrorableTextInput';
import ErrorableSelect from '@department-of-veterans-affairs/formation-react/ErrorableSelect';

class PaymentInformationEditModal extends React.Component {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    setPaymentInformationUiState: PropTypes.func.isRequired,
    paymentInformationUiState: PropTypes.object,
  };

  onSubmit = event => {
    event.preventDefault();

    const editedState = this.props.paymentInformationUiState.editModalFields;

    const routingNumberErrorMessage = this.getRoutingNumberErrorMessage(
      editedState.financialInstitutionRoutingNumber.field.value,
    );
    const accountNumberErrorMessage = this.getAccountNumberErrorMessage(
      editedState.accountNumber.field.value,
    );

    if (routingNumberErrorMessage || accountNumberErrorMessage) {
      this.setEditedState({
        financialInstitutionRoutingNumber: {
          ...editedState.financialInstitutionRoutingNumber,
          errorMessage: routingNumberErrorMessage,
        },
        accountNumber: {
          ...editedState.accountNumber,
          errorMessage: accountNumberErrorMessage,
        },
      });
    } else {
      this.props.onSubmit({
        financialInstitutionName: 'Hidden form field',
        financialInstitutionRoutingNumber:
          editedState.financialInstitutionRoutingNumber.field.value,
        accountNumber: editedState.accountNumber.field.value,
        accountType: editedState.accountType.value.value,
      });
    }
  };

  onRoutingNumberChanged = field => {
    const financialInstitutionRoutingNumber = {
      ...this.props.paymentInformationUiState.editModalFields
        .financialInstitutionRoutingNumber,
      field,
    };

    if (financialInstitutionRoutingNumber.field.dirty) {
      financialInstitutionRoutingNumber.errorMessage = this.getRoutingNumberErrorMessage(
        financialInstitutionRoutingNumber.field.value,
      );
    }

    this.setEditedState({ financialInstitutionRoutingNumber });
  };

  onAccountNumberChanged = field => {
    const accountNumber = {
      ...this.props.paymentInformationUiState.editModalFields.accountNumber,
      field,
    };

    if (accountNumber.field.dirty) {
      accountNumber.errorMessage = this.getAccountNumberErrorMessage(
        accountNumber.field.value,
      );
    }

    this.setEditedState({ accountNumber });
  };

  onAccountTypeChanged = value => {
    const accountType = {
      ...this.props.paymentInformationUiState.editModalFields.accountType,
      value,
    };

    this.setEditedState({ accountType });
  };

  setEditedState(vals) {
    this.props.setPaymentInformationUiState({
      editModalFields: {
        ...this.props.paymentInformationUiState.editModalFields,
        ...vals,
      },
    });
  }

  getRoutingNumberErrorMessage(value) {
    if (!value.match(/^\d{9}$/)) {
      return 'Please enter a valid routing number.';
    }
    return null;
  }

  getAccountNumberErrorMessage(value) {
    if (!value.match(/^\d{1,17}$/)) {
      return 'Please enter a valid account number.';
    }
    return null;
  }

  render() {
    const editedState = this.props.paymentInformationUiState.editModalFields;
    const lastResponse = this.props.paymentInformationUiState.response;

    return (
      <Modal
        title="Edit direct deposit information"
        visible={this.props.paymentInformationUiState.isEditing}
        onClose={this.props.onClose}
      >
        <AlertBox
          status="error"
          isVisible={lastResponse && lastResponse.errors.length}
        >
          <p>
            We’re sorry. Something went wrong on our end and we couldn’t save
            the recent updates you made to your profile. Please try again later.
          </p>
        </AlertBox>
        <p>Update your account and routing number</p>
        <img
          src="/img/direct-deposit-check-guide.png"
          alt="On a personal check, find your bank's 9-digit routing number listed along the bottom-left edge, and your account number listed beside that."
        />

        <form onSubmit={this.onSubmit}>
          <ErrorableTextInput
            label="Routing number (9 digits)"
            field={editedState.financialInstitutionRoutingNumber.field}
            errorMessage={
              editedState.financialInstitutionRoutingNumber.errorMessage
            }
            onValueChange={this.onRoutingNumberChanged}
            required
            charMax={9}
          />

          <ErrorableTextInput
            label="Account number (1-17 digits)"
            field={editedState.accountNumber.field}
            errorMessage={editedState.accountNumber.errorMessage}
            onValueChange={this.onAccountNumberChanged}
            required
            charMax={17}
          />

          <ErrorableSelect
            label="Account type"
            value={editedState.accountType.value}
            onValueChange={this.onAccountTypeChanged}
            options={editedState.accountType.options}
            required
          />

          <button
            type="submit"
            className="usa-button-primary vads-u-width--auto"
            disabled={this.props.paymentInformationUiState.isSaving}
          >
            Update
          </button>

          <button
            type="button"
            className="usa-button-secondary"
            onClick={this.props.onClose}
          >
            Cancel
          </button>
        </form>
      </Modal>
    );
  }
}

export default PaymentInformationEditModal;

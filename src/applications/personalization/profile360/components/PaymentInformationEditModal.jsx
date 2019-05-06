import React from 'react';
import PropTypes from 'prop-types';

import Modal from '@department-of-veterans-affairs/formation-react/Modal';
import ErrorableTextInput from '@department-of-veterans-affairs/formation-react/ErrorableTextInput';
import ErrorableSelect from '@department-of-veterans-affairs/formation-react/ErrorableSelect';

const ACCOUNT_TYPES_OPTIONS = {
  checking: 'Checking',
  savings: 'Savings',
};

class PaymentInformationEditModal extends React.Component {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    isVisible: PropTypes.bool.isRequired,
    paymentAccount: PropTypes.shape({
      accountNumber: PropTypes.string.isRequired,
      accountType: PropTypes.string.isRequired,
      financialInstitutionName: PropTypes.string.isRequired,
      financialInstitutionRoutingNumber: PropTypes.string.isRequired,
    }),
  };

  static getDerivedStateFromProps(props, state) {
    if (props.isVisible) {
      return state;
    }

    // Make sure the form is reset when the modal is not visible.
    return {
      financialInstitutionRoutingNumber: {
        field: {
          value: '',
          dirty: false,
        },
      },
      accountNumber: {
        field: {
          value: '',
          dirty: false,
        },
      },
      accountType: {
        value: {
          value: ACCOUNT_TYPES_OPTIONS.checking,
          dirty: false,
        },
      },
    };
  }

  onSubmit = () => {
    const routingNumberErrorMessage = this.getRoutingNumberErrorMessage(
      this.state.financialInstitutionRoutingNumber.field.value,
    );
    const accountNumberErrorMessage = this.getAccountNumberErrorMessage(
      this.state.accountNumber.field.value,
    );

    if (routingNumberErrorMessage || accountNumberErrorMessage) {
      this.setState({
        financialInstitutionRoutingNumber: {
          ...this.state.financialInstitutionRoutingNumber,
          errorMessage: routingNumberErrorMessage,
        },
        accountNumber: {
          ...this.state.accountNumber,
          errorMessage: accountNumberErrorMessage,
        },
      });
    } else {
      this.props.onSubmit();
    }
  };

  onRoutingNumberChanged = field => {
    const financialInstitutionRoutingNumber = {
      ...this.state.financialInstitutionRoutingNumber,
      field,
    };

    if (financialInstitutionRoutingNumber.field.dirty) {
      financialInstitutionRoutingNumber.errorMessage = this.getRoutingNumberErrorMessage(
        financialInstitutionRoutingNumber.field.value,
      );
    }

    this.setState({ financialInstitutionRoutingNumber });
  };

  onAccountNumberChanged = field => {
    const accountNumber = {
      ...this.state.accountNumber,
      field,
    };

    if (accountNumber.field.dirty) {
      accountNumber.errorMessage = this.getAccountNumberErrorMessage(
        accountNumber.field.value,
      );
    }

    this.setState({ accountNumber });
  };

  onAccountTypeChanged = value => {
    const accountType = {
      ...this.state.accountType,
      value,
    };

    this.setState({ accountType });
  };

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
    return (
      <Modal
        title="Edit direct deposit information"
        visible={this.props.isVisible}
        onClose={this.props.onClose}
      >
        <p>Update your account and routing number</p>
        <img
          src="/img/direct-deposit-check-guide.png"
          alt="On a personal check, find your bank's 9-digit routing number listed along the bottom-left edge, and your account number listed beside that."
        />

        <ErrorableTextInput
          label="Routing number (9 digits)"
          field={this.state.financialInstitutionRoutingNumber.field}
          errorMessage={
            this.state.financialInstitutionRoutingNumber.errorMessage
          }
          onValueChange={this.onRoutingNumberChanged}
          required
          charMax={9}
        />

        <ErrorableTextInput
          label="Account number (1-17 digits)"
          field={this.state.accountNumber.field}
          errorMessage={this.state.accountNumber.errorMessage}
          onValueChange={this.onAccountNumberChanged}
          required
          charMax={17}
        />

        <ErrorableSelect
          label="Account type"
          value={this.state.accountType.value}
          onValueChange={this.onAccountTypeChanged}
          options={Object.values(ACCOUNT_TYPES_OPTIONS)}
          required
        />

        <button
          type="button"
          className="usa-button-primary"
          onClick={this.onSubmit}
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
      </Modal>
    );
  }
}

export default PaymentInformationEditModal;

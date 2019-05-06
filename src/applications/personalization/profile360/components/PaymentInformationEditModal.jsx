import React from 'react';
import PropTypes from 'prop-types';

import Modal from '@department-of-veterans-affairs/formation-react/Modal';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import ErrorableTextInput from '@department-of-veterans-affairs/formation-react/ErrorableTextInput';
import ErrorableSelect from '@department-of-veterans-affairs/formation-react/ErrorableSelect';

const ACCOUNT_TYPES_OPTIONS = {
  checking: 'Checking',
  savings: 'Savings',
};

class PaymentInformationEditModal extends React.Component {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    isVisible: PropTypes.bool.isRequired,
    status: PropTypes.object,
  };

  static getDerivedStateFromProps(props, state) {
    if (props.isVisible) {
      return state;
    }

    // Make sure the form is reset when the modal is not visible.
    return PaymentInformationEditModal.getClearedForm();
  }

  static getClearedForm() {
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

  constructor(props) {
    super(props);
    this.state = PaymentInformationEditModal.getClearedForm();
  }

  onSubmit = event => {
    event.preventDefault();

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
      this.props.onSubmit({
        financialInstitutionName: 'Hidden form field',
        financialInstitutionRoutingNumber: this.state
          .financialInstitutionRoutingNumber.field.value,
        accountNumber: this.state.accountNumber.field.value,
        accountType: this.state.accountType.value.value,
      });
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
    const lastResponse = this.props.status.response;

    return (
      <Modal
        title="Edit direct deposit information"
        visible={this.props.isVisible}
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
            type="submit"
            className="usa-button-primary vads-u-width--auto"
            disabled={this.props.status.isSaving}
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

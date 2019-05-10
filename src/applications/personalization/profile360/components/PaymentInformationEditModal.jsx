import React from 'react';
import PropTypes from 'prop-types';

import Modal from '@department-of-veterans-affairs/formation-react/Modal';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import ErrorableTextInput from '@department-of-veterans-affairs/formation-react/ErrorableTextInput';
import ErrorableSelect from '@department-of-veterans-affairs/formation-react/ErrorableSelect';

import { focusElement } from 'platform/utilities/ui';

import {
  getAccountNumberErrorMessage,
  getRoutingNumberErrorMessage,
} from '../util';
import { ACCOUNT_TYPES_OPTIONS } from '../constants';

class PaymentInformationEditModal extends React.Component {
  static propTypes = {
    fields: PropTypes.object,
    isEditing: PropTypes.bool.isRequired,
    isSaving: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    editModalFieldChanged: PropTypes.func.isRequired,
    responseError: PropTypes.object,
  };

  onSubmit = event => {
    event.preventDefault();

    const {
      financialInstitutionRoutingNumber: routingNumber,
      accountNumber,
      accountType,
    } = this.props.fields;

    if (routingNumber.errorMessage) {
      focusElement('[name=routing-number]');
    } else if (accountNumber.errorMessage) {
      focusElement('[name=account-number]');
    } else {
      this.props.onSubmit({
        financialInstitutionName: 'Hidden form field',
        financialInstitutionRoutingNumber: routingNumber.field.value,
        accountNumber: accountNumber.field.value,
        accountType: accountType.value.value,
      });
    }
  };

  onRoutingNumberChanged = field => {
    this.props.editModalFieldChanged('financialInstitutionRoutingNumber', {
      field,
      errorMessage: field.dirty && getRoutingNumberErrorMessage(field.value),
    });
  };

  onAccountNumberChanged = field => {
    this.props.editModalFieldChanged('accountNumber', {
      field,
      errorMessage: field.dirty && getAccountNumberErrorMessage(field.value),
    });
  };

  onAccountTypeChanged = value => {
    this.props.editModalFieldChanged('accountType', { value });
  };

  render() {
    const {
      financialInstitutionRoutingNumber: routingNumber,
      accountNumber,
      accountType,
    } = this.props.fields;

    const lastResponse = this.props.responseError;

    return (
      <Modal
        title="Edit direct deposit information"
        visible={this.props.isEditing}
        onClose={this.props.onClose}
      >
        <AlertBox
          status="error"
          isVisible={!!lastResponse && lastResponse.errors.length}
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
            name="routing-number"
            field={routingNumber.field}
            errorMessage={routingNumber.errorMessage}
            onValueChange={this.onRoutingNumberChanged}
            required
            charMax={9}
          />

          <ErrorableTextInput
            label="Account number (No more than 17 digits)"
            name="account-number"
            field={accountNumber.field}
            errorMessage={accountNumber.errorMessage}
            onValueChange={this.onAccountNumberChanged}
            required
            charMax={17}
          />

          <ErrorableSelect
            label="Account type"
            value={accountType.value}
            onValueChange={this.onAccountTypeChanged}
            options={Object.values(ACCOUNT_TYPES_OPTIONS)}
            required
          />

          <button
            type="submit"
            className="usa-button-primary vads-u-width--auto"
            disabled={this.props.isSaving}
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

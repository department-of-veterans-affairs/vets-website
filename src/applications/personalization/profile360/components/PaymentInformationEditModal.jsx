import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import set from 'platform/utilities/data/set';

import Modal from '@department-of-veterans-affairs/formation-react/Modal';
import ErrorableTextInput from '@department-of-veterans-affairs/formation-react/ErrorableTextInput';
import ErrorableSelect from '@department-of-veterans-affairs/formation-react/ErrorableSelect';
import LoadingButton from 'platform/site-wide/loading-button/LoadingButton';

import { focusElement } from 'platform/utilities/ui';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';

import { profileUseSchemaForms } from 'vet360/selectors';

import {
  getAccountNumberErrorMessage,
  getRoutingNumberErrorMessage,
  getAccountTypeErrorMessage,
} from '../util/paymentInformation';
import { ACCOUNT_TYPES_OPTIONS } from '../constants';

import PaymentInformationEditModalError from './PaymentInformationEditModalError';

const schema = {
  type: 'object',
  properties: {
    routingNumber: {
      type: 'string',
      pattern: '^\\d{9}$',
    },
    accountNumber: {
      type: 'string',
      pattern: '^\\d{1,17}$',
    },
    accountType: {
      type: 'string',
      enum: Object.values(ACCOUNT_TYPES_OPTIONS),
    },
  },
  required: ['accountNumber', 'routingNumber', 'accountType'],
};

const uiSchema = {
  routingNumber: {
    'ui:title':
      'Routing number (Your 9-digit routing number will update your bank’s name)',
    'ui:errorMessages': {
      pattern: 'Please enter the bank’s 9-digit routing number.',
      required: 'Please enter the bank’s 9-digit routing number.',
    },
  },
  accountNumber: {
    'ui:title': 'Account number (No more than 17 digits)',
    'ui:errorMessages': {
      pattern: 'Please enter your account number.',
      required: 'Please enter your account number.',
    },
  },
  accountType: {
    'ui:title': 'Account type',
    'ui:errorMessages': {
      required: 'Please select the type that best describes the account.',
    },
  },
};

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

  state = {
    formData: {},
  };

  componentDidUpdate = prevProps => {
    if (this.props.isEditing && !prevProps.isEditing) {
      this.setState({ formData: {} });
    }
  };

  onSubmit = event => {
    event.preventDefault();

    let {
      financialInstitutionRoutingNumber: routingNumber,
      accountNumber,
      accountType,
    } = this.props.fields;

    routingNumber = set('field.dirty', true, routingNumber);
    routingNumber = set(
      'errorMessage',
      getRoutingNumberErrorMessage(routingNumber.field.value),
      routingNumber,
    );

    accountNumber = set('field.dirty', true, accountNumber);
    accountNumber = set(
      'errorMessage',
      getAccountNumberErrorMessage(accountNumber.field.value),
      accountNumber,
    );

    accountType = set('field.dirty', true, accountType);
    accountType = set(
      'errorMessage',
      getAccountTypeErrorMessage(accountType.value.value),
      accountType,
    );

    this.props.editModalFieldChanged(
      'financialInstitutionRoutingNumber',
      routingNumber,
    );
    this.props.editModalFieldChanged('accountNumber', accountNumber);
    this.props.editModalFieldChanged('accountType', accountType);

    if (routingNumber.errorMessage) {
      focusElement('[name=routing-number]');
    } else if (accountNumber.errorMessage) {
      focusElement('[name=account-number]');
    } else if (accountType.errorMessage) {
      focusElement('[name=account-type]');
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
    this.props.editModalFieldChanged('accountType', {
      value,
      errorMessage: value.dirty && getAccountTypeErrorMessage(value.value),
    });
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
    const {
      financialInstitutionRoutingNumber: routingNumber,
      accountNumber,
      accountType,
    } = this.props.fields;

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

        {!this.props.useSchemaForm && (
          <form onSubmit={this.onSubmit}>
            <ErrorableTextInput
              label="Routing number (Your 9-digit routing number will update your bank’s name)"
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
              name="account-type"
              value={accountType.value}
              errorMessage={accountType.errorMessage}
              onValueChange={this.onAccountTypeChanged}
              options={Object.values(ACCOUNT_TYPES_OPTIONS)}
              includeBlankOption
              required
            />

            <LoadingButton
              type="submit"
              className="usa-button-primary vads-u-width--full small-screen:vads-u-width--auto"
              isLoading={this.props.isSaving}
            >
              Update
            </LoadingButton>

            <button
              type="button"
              disabled={this.props.isSaving}
              className="usa-button-secondary"
              onClick={this.props.onClose}
            >
              Cancel
            </button>
          </form>
        )}

        {this.props.useSchemaForm && (
          <SchemaForm
            name="Direct Deposit Information"
            title="Direct Deposit Information"
            schema={schema}
            uiSchema={uiSchema}
            onSubmit={this.formSubmit}
            onChange={formData => this.setState({ formData })}
            data={this.state.formData}
          >
            <LoadingButton
              type="submit"
              className="usa-button-primary vads-u-margin-top--0 vads-u-width--full small-screen:vads-u-width--auto"
              isLoading={this.props.isSaving}
            >
              Update
            </LoadingButton>

            <button
              type="button"
              disabled={this.props.isSaving}
              className="usa-button-secondary"
              onClick={this.props.onClose}
            >
              Cancel
            </button>
          </SchemaForm>
        )}
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  useSchemaForm: profileUseSchemaForms(state),
});

export { PaymentInformationEditModal };

export default connect(mapStateToProps)(PaymentInformationEditModal);

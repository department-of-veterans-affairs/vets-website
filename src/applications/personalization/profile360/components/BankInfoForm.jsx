import React from 'react';
import PropTypes from 'prop-types';

import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import LoadingButton from 'platform/site-wide/loading-button/LoadingButton';

import { ACCOUNT_TYPES_OPTIONS } from '../constants';

export const schema = {
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

export const uiSchema = {
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

const BankInfoForm = ({
  cancelButtonClasses,
  formChange,
  formData,
  formSubmit,
  isSaving,
  onClose,
}) => (
  <SchemaForm
    // name and title are used internally by the SchemaForm
    name="Direct Deposit Information"
    title="Direct Deposit Information"
    schema={schema}
    uiSchema={uiSchema}
    data={formData}
    onChange={formChange}
    onSubmit={formSubmit}
  >
    <LoadingButton
      type="submit"
      className="usa-button-primary vads-u-margin-top--0 vads-u-width--full small-screen:vads-u-width--auto"
      isLoading={isSaving}
      data-testid="submit-button"
    >
      Update
    </LoadingButton>

    <button
      type="button"
      disabled={isSaving}
      className={cancelButtonClasses.join(' ')}
      onClick={onClose}
      data-testid="cancel-button"
    >
      Cancel
    </button>
  </SchemaForm>
);

BankInfoForm.propTypes = {
  // Classes to apply to the form's "cancel" button. Defaults to ['usa-button-secondary']
  cancelButtonClasses: PropTypes.arrayOf(PropTypes.string).isRequired,
  formChange: PropTypes.func.isRequired,
  formData: PropTypes.object.isRequired,
  formSubmit: PropTypes.func.isRequired,
  isSaving: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

BankInfoForm.defaultProps = {
  cancelButtonClasses: ['usa-button-secondary'],
};

export default BankInfoForm;

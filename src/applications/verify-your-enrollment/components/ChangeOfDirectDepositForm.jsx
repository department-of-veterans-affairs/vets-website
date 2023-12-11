import React from 'react';
import PropTypes from 'prop-types';

import phoneUI from '@department-of-veterans-affairs/platform-forms-system/phone';
import SchemaForm from '@department-of-veterans-affairs/platform-forms-system/SchemaForm';

export function makeFormProperties(prefix) {
  return {
    accountType: `${prefix}AccountType`,
    routingNumber: `${prefix}RoutingNumber`,
    accountNumber: `${prefix}AccountNumber`,
    verifyAccountNumber: `${prefix}VerifyAccountNumber`,
    bankName: `${prefix}BankName`,
    bankPhone: `${prefix}BankPhone`,
  };
}

export function makeSchemas(prefix) {
  const properties = makeFormProperties(prefix);
  const schema = {
    type: 'object',
    properties: {
      [properties.accountType]: {
        type: 'string',
        enum: ['Checking', 'Savings'],
      },
      [properties.bankName]: {
        type: 'string',
      },
      [properties.bankPhone]: {
        type: 'string',
        pattern: '^\\d{10}$',
      },
      [properties.routingNumber]: {
        type: 'string',
        pattern: '^\\d{9}$',
      },
      [properties.accountNumber]: {
        type: 'string',
        pattern: '^\\d{1,17}$',
      },
      [properties.verifyAccountNumber]: {
        type: 'string',
        pattern: '^\\d{1,17}$',
      },
    },
    required: [
      properties.bankName,
      properties.bankPhone,
      properties.accountType,
      properties.accountNumber,
      properties.routingNumber,
      properties.verifyAccountNumber,
    ],
  };

  const uiSchema = {
    [properties.bankName]: {
      'ui:title': 'Name of Financial Institution',
      'ui:errorMessages': {
        required: 'Please enter the name of your Financial Institution',
      },
    },
    [properties.bankPhone]: phoneUI(
      'Telephone Number of Financial Institution',
    ),
    [properties.accountType]: {
      'ui:title': 'Account type',
      'ui:widget': 'radio',
      'ui:errorMessages': {
        required: 'Please select the type that best describes your account',
      },
    },
    [properties.routingNumber]: {
      'ui:title': 'Routing number',
      'ui:errorMessages': {
        pattern: 'Please enter your bank’s 9-digit routing number',
        required: 'Please enter your bank’s 9-digit routing number',
      },
    },
    [properties.accountNumber]: {
      'ui:title': 'Account number (This should be no more than 17 digits)',
      'ui:errorMessages': {
        pattern: 'Please enter your account number',
        required: 'Please enter your account number',
      },
    },
    [properties.verifyAccountNumber]: {
      'ui:title': 'Verify account number',
      'ui:errorMessages': {
        pattern: 'Please enter your account number',
        required: 'Please enter your account number',
      },
      'ui:validations': [
        (errors, field, formData) => {
          if (field !== formData[properties.accountNumber]) {
            errors.addError('Account Numbers do not match');
          }
        },
      ],
    },
  };

  return { schema, uiSchema };
}

const ChangeOfDirectDepositForm = ({
  children,
  formChange,
  formData,
  formPrefix,
  formSubmit,
}) => {
  const { schema, uiSchema } = makeSchemas(formPrefix);

  return (
    <SchemaForm
      addNameAttribute
      name="Direct Deposit Information"
      // title is required by the SchemaForm and used internally
      title="Direct Deposit Information"
      schema={schema}
      uiSchema={uiSchema}
      data={formData}
      onChange={formChange}
      onSubmit={formSubmit}
      data-testid="change-of-direct-deposit-form"
    >
      {children}
    </SchemaForm>
  );
};

ChangeOfDirectDepositForm.propTypes = {
  formChange: PropTypes.func.isRequired,
  formData: PropTypes.object.isRequired,
  // Prefix to apply to all the form's schema fields
  formPrefix: PropTypes.string.isRequired,
  formSubmit: PropTypes.func.isRequired,
  cancelButtonClasses: PropTypes.arrayOf(PropTypes.string),
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
};

ChangeOfDirectDepositForm.defaultProps = {
  cancelButtonClasses: ['usa-button-secondary'],
};

export default ChangeOfDirectDepositForm;

import React from 'react';
import PropTypes from 'prop-types';

import phoneUI from '@department-of-veterans-affairs/platform-forms-system/phone';
import emailUI from '@department-of-veterans-affairs/platform-forms-system/email';
import SchemaForm from '@department-of-veterans-affairs/platform-forms-system/SchemaForm';
import { VaRadioField } from '@department-of-veterans-affairs/platform-forms-system/web-component-fields';
import { CHANGE_OF_DIRECT_DEPOSIT_TITLE } from '../constants';

export function makeFormProperties(prefix) {
  return {
    phone: `${prefix}phone`,
    phone2: `${prefix}phone`,
    email: `${prefix}email`,
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
      [properties.phone]: {
        type: 'string',
        pattern: '^\\d{10}$',
      },
      [properties.email]: {
        type: 'string',
        pattern:
          '^[_A-Za-z0-9-]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$',
      },
      [properties.accountType]: {
        type: 'string',
        enum: ['Checking', 'Savings'],
      },
      [properties.bankName]: {
        type: 'string',
        maxLength: 55,
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
      properties.phone,
      properties.email,
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
      'ui:title': 'Name of financial institution ',
      'ui:errorMessages': {
        required: 'Please enter the name of your Financial Institution',
      },
    },
    [properties.phone]: phoneUI("Veteran's phone number "),
    [properties.email]: emailUI("Veteran's email address "),
    [properties.bankPhone]: phoneUI(
      'Telephone number of financial institution',
    ),
    [properties.accountType]: {
      'ui:title': 'Account type',
      'ui:webComponentField': VaRadioField,
      'ui:errorMessages': {
        required: 'Please select the type that best describes your account',
      },
    },
    [properties.routingNumber]: {
      'ui:title': 'Routing number ',
      'ui:errorMessages': {
        pattern: 'Please enter your bank’s 9-digit routing number',
        required: 'Please enter your bank’s 9-digit routing number',
      },
    },
    [properties.accountNumber]: {
      'ui:title': 'Account number (This should be no more than 17 digits) ',
      'ui:errorMessages': {
        pattern: 'Please enter your account number',
        required: 'Please enter your account number',
      },
    },
    [properties.verifyAccountNumber]: {
      'ui:title': 'Verify account number ',
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
      title={CHANGE_OF_DIRECT_DEPOSIT_TITLE}
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
  defaultName: PropTypes.string,
};

ChangeOfDirectDepositForm.defaultProps = {
  cancelButtonClasses: ['usa-button-secondary'],
};

export default ChangeOfDirectDepositForm;

import React from 'react';
import PropTypes from 'prop-types';

import SchemaForm from '~/platform/forms-system/src/js/components/SchemaForm';

import { ACCOUNT_TYPES_OPTIONS } from '../../constants';

export function makeFormProperties(prefix) {
  return {
    routingNumber: `${prefix}RoutingNumber`,
    accountNumber: `${prefix}AccountNumber`,
    accountType: `${prefix}AccountType`,
  };
}

function makeSchemas(prefix) {
  const properties = makeFormProperties(prefix);
  const schema = {
    type: 'object',
    properties: {
      [properties.routingNumber]: {
        type: 'string',
        pattern: '^\\d{9}$',
      },
      [properties.accountNumber]: {
        type: 'string',
        pattern: '^\\d{1,17}$',
      },
      [properties.accountType]: {
        type: 'string',
        enum: Object.values(ACCOUNT_TYPES_OPTIONS),
      },
    },
    required: [
      properties.accountNumber,
      properties.routingNumber,
      properties.accountType,
    ],
  };

  const uiSchema = {
    [properties.routingNumber]: {
      'ui:title':
        'Routing number (Your bank’s name will appear after you add the 9-digit routing number)',
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
    [properties.accountType]: {
      'ui:title': 'Account type',
      'ui:errorMessages': {
        required: 'Please select the type that best describes your account',
      },
    },
  };

  return { schema, uiSchema };
}

const BankInfoForm = ({
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
    >
      {children}
    </SchemaForm>
  );
};

BankInfoForm.propTypes = {
  formChange: PropTypes.func.isRequired,
  formData: PropTypes.object.isRequired,
  // Prefix to apply to all the form's schema fields
  formPrefix: PropTypes.string.isRequired,
  formSubmit: PropTypes.func.isRequired,
};

BankInfoForm.defaultProps = {
  cancelButtonClasses: ['usa-button-secondary'],
};

export default BankInfoForm;

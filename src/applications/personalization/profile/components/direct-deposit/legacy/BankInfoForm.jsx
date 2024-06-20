import React from 'react';
import PropTypes from 'prop-types';

import SchemaForm from '~/platform/forms-system/src/js/components/SchemaForm';
import { ACCOUNT_TYPES_OPTIONS } from '../../../constants';

export function makeFormProperties(prefix) {
  return {
    accountType: `${prefix}AccountType`,
    routingNumber: `${prefix}RoutingNumber`,
    accountNumber: `${prefix}AccountNumber`,
  };
}

function makeSchemas(prefix) {
  const properties = makeFormProperties(prefix);
  const schema = {
    type: 'object',
    properties: {
      [properties.accountType]: {
        type: 'string',
        enum: Object.values(ACCOUNT_TYPES_OPTIONS),
      },
      [properties.routingNumber]: {
        type: 'string',
        pattern: '^\\d{9}$',
      },
      [properties.accountNumber]: {
        type: 'string',
        pattern: '^\\d{1,17}$',
      },
    },
    required: [
      properties.accountType,
      properties.accountNumber,
      properties.routingNumber,
    ],
  };

  const uiSchema = {
    [properties.accountType]: {
      'ui:widget': 'radio',
      'ui:title': 'Account type',
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
  cancelButtonClasses: PropTypes.arrayOf(PropTypes.string),
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
};

BankInfoForm.defaultProps = {
  cancelButtonClasses: ['usa-button-secondary'],
};

export default BankInfoForm;

import React from 'react';
import PropTypes from 'prop-types';
import merge from 'lodash/merge';

import SchemaForm from '~/platform/forms-system/src/js/components/SchemaForm';
import { ACCOUNT_TYPES_OPTIONS } from '../../constants';
import { BankNumberFaq } from './BankNumberFaq';

function makeSchemas() {
  const bankAccountProperties = {
    type: 'object',
    properties: {
      accountType: {
        type: 'string',
        enum: Object.values(ACCOUNT_TYPES_OPTIONS),
      },
      routingNumber: {
        type: 'string',
        pattern: '^\\d{9}$',
      },
      accountNumber: {
        type: 'string',
        pattern: '^\\d{1,17}$',
      },
      'view:directDepositInfo': {
        type: 'object',
        properties: {},
      },
    },
  };
  const schema = {
    type: 'object',
    properties: {
      bankAccount: bankAccountProperties,
    },
    required: [
      bankAccountProperties.properties.accountType,
      bankAccountProperties.properties.accountNumber,
      bankAccountProperties.properties.routingNumber,
    ],
  };

  const uiSchema = {
    'ui:description':
      'Please provide your bank’s routing number as well as your current account and type.',
    bankAccount: merge(
      {},
      {
        accountType: {
          'ui:widget': 'radio',
          'ui:title': 'Account type',
          // 'ui:options': {
          //   labels: ACCOUNT_TYPES_OPTIONS,
          // },
          'ui:errorMessages': {
            required: 'Please select the type that best describes your account',
          },
        },
        routingNumber: {
          'ui:title': 'Routing number',
          // 'ui:validations': [validateRoutingNumber],
          'ui:errorMessages': {
            pattern: 'Please enter your bank’s 9-digit routing number',
            required: 'Please enter your bank’s 9-digit routing number',
          },
        },
        accountNumber: {
          'ui:title': 'Account number (No more than 17 digits)',
          'ui:errorMessages': {
            pattern: 'Please enter your account number',
            required: 'Please enter your account number',
          },
        },
        'view:directDepositInfo': {
          'ui:description': BankNumberFaq,
          'ui:options': {
            hideOnReview: true,
          },
        },
      },
    ),
  };

  return { schema, uiSchema };
}

export const AccountUpdateView = ({
  children,
  formChange,
  formData,
  formSubmit,
}) => {
  const { schema, uiSchema } = makeSchemas();

  return (
    <>
      <strong>Account</strong>
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
    </>
  );
};

AccountUpdateView.propTypes = {
  formChange: PropTypes.func.isRequired,
  formData: PropTypes.object.isRequired,
  formSubmit: PropTypes.func.isRequired,
  cancelButtonClasses: PropTypes.arrayOf(PropTypes.string),
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
};

AccountUpdateView.defaultProps = {
  cancelButtonClasses: ['usa-button-secondary'],
};

export default AccountUpdateView;

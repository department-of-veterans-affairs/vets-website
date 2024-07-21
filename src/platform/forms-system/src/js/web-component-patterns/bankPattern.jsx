import React from 'react';
import { VaTextInputField } from 'platform/forms-system/src/js/web-component-fields';
import { radioUI, radioSchema } from './radioPattern';
import { validateRoutingNumber } from '../validation';

/**
 * @module BankPattern
 */

const accountTypeLabels = {
  checking: 'Checking',
  savings: 'Savings',
};

// Styled to match the description in the titleUI pattern
const BankAccountDescription = () => (
  <p className="vads-u-color--gray-dark vads-u-font-family--sans vads-u-font-weight--normal vads-u-font-size--base vads-u-line-height--4">
    Enter the details of the bank account where you want to get your VA benefit
    payments.
  </p>
);

/**
 * Web component pattern for bank account information.
 *
 * @example
 * // Simple usage:
 * bankAccount: bankAccountUI(),
 *
 * // Custom labels
 * bankAccount: bankAccountUI({
 *   labels: {
 *     accountNumberLabel: 'Account number',
 *     routingNumberLabel: 'Routing number',
 *   },
 * })
 *
 * * // Omit bank name field
 * bankAccount: bankAccountUI({ omitBankName: true })
 * @param {Object} options
 * @param {Object} [options.labels]
 * @param {string} [options.labels.accountTypeLabel='Account type']
 * @param {string} [options.labels.bankNameLabel='Bank name']
 * @param {string} [options.labels.accountNumberLabel='Bank account number']
 * @param {string} [options.labels.routingNumberLabel='Bank routing number']
 * @param {boolean} [options.omitBankName=false]
 * @returns {UISchemaOptions}
 * @function
 */
const bankAccountUI = ({
  labels: {
    accountTypeLabel = 'Account type',
    bankNameLabel = 'Bank name',
    accountNumberLabel = 'Bank account number',
    routingNumberLabel = 'Bank routing number',
  } = {},
  omitBankName = false,
} = {}) => {
  const uiSchema = {
    'ui:description': BankAccountDescription,
    accountType: radioUI({
      title: accountTypeLabel,
      labels: accountTypeLabels,
      classNames: 'vads-u-margin-bottom--2',
    }),
    accountNumber: {
      'ui:title': accountNumberLabel,
      'ui:webComponentField': VaTextInputField,
      'ui:errorMessages': {
        required: 'Please enter a bank account number',
      },
    },
    routingNumber: {
      'ui:title': routingNumberLabel,
      'ui:webComponentField': VaTextInputField,
      'ui:validations': [validateRoutingNumber],
      'ui:errorMessages': {
        pattern: 'Please enter a valid nine-digit routing number',
        required: 'Please enter a routing number',
      },
    },
  };

  if (!omitBankName) {
    uiSchema.bankName = {
      'ui:title': bankNameLabel,
      'ui:webComponentField': VaTextInputField,
    };
  }

  return uiSchema;
};

/**
 * @example
 * schema: {
 *   accountInformation: bankAccountSchema(),
 *   accountInformationWithoutBankName: bankAccountSchema({ omitBankName: true })
 * }
 * @param {Object} [options] - Options for customizing the bank account schema.
 * @param {boolean} [options.omitBankName=false] - Whether to omit the bank name field.
 * @returns {SchemaOptions}
 * @function
 */
const bankAccountSchema = ({ omitBankName = false } = {}) => {
  const schema = {
    type: 'object',
    required: ['accountType', 'accountNumber', 'routingNumber'],
    properties: {
      accountType: radioSchema(Object.keys(accountTypeLabels)),
      bankName: {
        type: 'string',
      },
      accountNumber: {
        type: 'string',
      },
      routingNumber: {
        type: 'string',
        pattern: '^\\d{9}$',
      },
    },
  };

  if (omitBankName) {
    delete schema.properties.bankName;
  }

  return schema;
};

export { bankAccountUI, bankAccountSchema };

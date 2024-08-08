import React from 'react';
import { VaTextInputField } from 'platform/forms-system/src/js/web-component-fields';
import { radioUI, radioSchema } from './radioPattern';
import { validateRoutingNumber } from '../validation';

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
 * ```js
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
 * ```
 * @param {{
 *   labels?: {
 *     accountTypeLabel?: string,
 *     bankNameLabel?: string,
 *     accountNumberLabel?: string,
 *     routingNumberLabel?: string,
 *   },
 *   omitBankName?: boolean, // Whether to omit the bank name field.
 * }} options
 * @returns {UISchemaOptions}
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
 * ```js
 * schema: {
 *   accountInformation: bankAccountSchema(),
 *   accountInformationWithoutBankName: bankAccountSchema({ omitBankName: true })
 * }
 * ```
 * @param {{ omitBankName: boolean }} [options] - Options for customizing the bank account schema.
 * @returns {SchemaOptions}
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

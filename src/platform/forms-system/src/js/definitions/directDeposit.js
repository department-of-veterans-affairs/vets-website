// Copy ~/adhoc/vets-website/src/applications/edu-benefits/10203/pages/directDeposit.js
//
// Add field: bankName
// Optional fields: bankName, declineDirectDeposit
import merge from 'lodash/merge';

import bankAccountUI from 'platform/forms/definitions/bankAccount';
import {
  directDepositDescription,
  bankInfoHelpText,
  directDepositAlert,
} from './content/directDeposit';

const defaultOptionalFields = {
  declineDirectDeposit: false,
  bankName: false,
};

const useDirectDeposit = form => !form?.declineDirectDeposit;

const uiSchema = optionalFields => {
  const ui = {
    'ui:title': 'Direct deposit',
    'ui:description': directDepositDescription,
    bankAccount: {
      // NOTE: The ui:order is missing bankName on purpose; it's only added if
      // the the optional field is desired because adding additional properties
      // to the ui:order which don't exist in the schema will throw an error.
      'ui:order': ['accountType', 'routingNumber', 'accountNumber'],
      accountType: {
        ...bankAccountUI.accountType,
        'ui:required': useDirectDeposit,
      },
      // Optional fields such as bankName are added to the uiSchema here because
      // they'll be ignored if the corresponding property in the schema isn't
      // found.
      bankName: {
        'ui:title': 'Bank name',
      },
      routingNumber: {
        ...bankAccountUI.routingNumber,
        'ui:title': 'Bank routing number',
        'ui:required': useDirectDeposit,
      },
      accountNumber: {
        ...bankAccountUI.accountNumber,
        'ui:title': 'Bank account number',
        'ui:required': useDirectDeposit,
      },
      'ui:options': {
        classNames: 'vads-u-margin-bottom--3',
        hideIf: form => form?.declineDirectDeposit,
      },
    },
    declineDirectDeposit: {
      'ui:title': "I don't want to use direct deposit",
      'ui:options': {
        hideOnReviewIfFalse: true,
      },
    },
    'view:directDespositInfo': {
      'ui:description': directDepositAlert,
    },
    'view:bankInfoHelpText': {
      'ui:description': bankInfoHelpText,
      'ui:options': {
        classNames: 'vads-u-margin-top--4',
      },
    },
  };

  // Add optional fields
  // If set to true, use the default uiSchema
  // If it has a uiSchema property, use that
  if (optionalFields.declineDirectDeposit) {
    ui.properties.declineDirectDeposit = optionalFields.declineDirectDeposit
      .uiSchema
      ? optionalFields.declineDirectDeposit.uiSchema
      : {
          'ui:title': 'I don’t want to use direct deposit',
          'ui:options': {
            hideOnReviewIfFalse: true,
          },
        };
  }
  // TODO: Update the ui:order
  if (optionalFields.bankName) {
    ui.properties.bankAccount.bankName = optionalFields.bankName.uiSchema
      ? optionalFields.bankName.uiSchema
      : { 'ui:title': 'Bank name' };
  }

  return ui;
};

const schema = optionalFields => {
  const s = {
    type: 'object',
    properties: {
      bankAccount: {
        type: 'object',
        properties: {
          accountType: {
            type: 'string',
            enum: ['checking', 'savings'],
          },
          routingNumber: {
            type: 'string',
            pattern: '^\\d{9}$',
          },
          accountNumber: {
            type: 'string',
          },
        },
      },
    },
  };

  // Add optional fields
  // If set to true, use the default schema
  // If it has a schema property, use that
  if (optionalFields.declineDirectDeposit) {
    s.properties.declineDirectDeposit = optionalFields.declineDirectDeposit
      .schema
      ? optionalFields.declineDirectDeposit.schema
      : { type: 'boolean' };
  }
  if (optionalFields.bankName) {
    s.properties.bankAccount.bankName = optionalFields.bankName.schema
      ? optionalFields.bankName.schema
      : { type: 'string' };
  }

  return s;
};

/**
 * @type {Object} OptionalField
 * @property {Object} schema - The schema for the field
 * @property {Object} uiSchema - The uiSchema for the field
 */

/**
 * Get the schema and uiSchema for direct deposit.
 *
 * @param {bool|OptionalField} [optionalFields.declineDirectDeposit] - Set to true
 *        to add the declineDirectDeposit field the default schema and uiSchema.
 *        Pass an object with schema and uiSchema properties to override either
 *        or both.
 * @param {bool|OptionalField} [optionalFields.bankName] - Set to true to add the
 *        bankName field with the default schema and uiSchema. Pass an object
 *        with schema and uiSchema properties to override either or both.
 */
export default optionalFields => {
  const opts = merge({}, defaultOptionalFields, optionalFields);
  return {
    uiSchema: uiSchema(opts),
    schema: schema(opts),
  };
};

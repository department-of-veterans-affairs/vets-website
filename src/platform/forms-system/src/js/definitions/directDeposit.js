import React from 'react';

import _ from 'platform/utilities/data';

import bankAccountUI from 'platform/forms/definitions/bankAccount';
import ReviewCardField from '../components/ReviewCardField';
import viewifyFields from '../utilities/viewify-fields';

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

const viewComponent = (...props) => (
  <code>{JSON.stringify(props, null, 2)}</code>
);

const uiSchema = ({ affectedBenefits, unaffectedBenefits, optionalFields }) => {
  const ui = {
    'ui:field': ReviewCardField,
    'ui:options': {
      viewComponent,
    },
    'ui:title': 'Direct deposit information',
    'ui:description': viewComponent,
    'ui:order': [
      'bankAccount',
      'declineDirectDeposit',
      'view:directDespositInfo',
      'view:bankInfoHelpText',
    ],
    bankAccount: {
      'ui:description': directDepositDescription,
      'ui:order': ['accountType', 'bankName', 'routingNumber', 'accountNumber'],
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
        'ui:title': 'Bank routing number (No more than 9 digits)',
        'ui:required': useDirectDeposit,
      },
      accountNumber: {
        ...bankAccountUI.accountNumber,
        'ui:title': 'Bank account number (No more than 17 digits)',
        'ui:required': useDirectDeposit,
      },
      'ui:options': {
        classNames: 'vads-u-margin-bottom--3',
        // eslint-disable-next-line react-hooks/rules-of-hooks
        hideIf: form => !useDirectDeposit(form),
      },
    },
    declineDirectDeposit: {
      'ui:title': 'I don’t want to use direct deposit',
      'ui:options': {
        hideOnReviewIfFalse: true,
      },
    },
    'view:directDespositInfo': {
      'ui:description': directDepositAlert({
        affectedBenefits,
        unaffectedBenefits,
      }),
    },
    'view:bankInfoHelpText': {
      'ui:description': bankInfoHelpText,
      'ui:options': {
        classNames: 'vads-u-margin-top--4',
      },
    },
  };

  if (!optionalFields.declineDirectDeposit) {
    // We're not using declineDirectDeposit; Remove the entry from ui:order so
    // it doesn't error out
    const i = ui['ui:order'].indexOf('declineDirectDeposit');
    if (i !== -1) ui['ui:order'].splice(i, 1);
  }
  // Override the field's uiSchema if available
  if (optionalFields.declineDirectDeposit?.uiSchema) {
    ui.declineDirectDeposit = optionalFields.declineDirectDeposit.uiSchema;
  }

  if (!optionalFields.bankName) {
    // We're not using bankName; Remove the entry from ui:order so
    // it doesn't error out
    const i = ui.bankAccount['ui:order'].indexOf('bankName');
    if (i !== -1) ui.bankAccount['ui:order'].splice(i, 1);
  }
  // Override the field's uiSchema if available
  if (optionalFields.bankName?.uiSchema) {
    ui.bankAccount.bankName = optionalFields.bankName.uiSchema;
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
      'view:directDespositInfo': { type: 'object', properties: {} },
      'view:bankInfoHelpText': { type: 'object', properties: {} },
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
    s.properties.bankAccount.properties.bankName = optionalFields.bankName
      .schema
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
 * @param {string} [options.affectedBenefits] - A list of affected benefits.
 *        This is used in `directDepositAlert` in `./content/directDeposit.jsx`.
 *        Example: "disability compensation, pension, and education"
 * @param {string} [options.unaffectedBenefits] - A list of benefits NOT
 *        affected. This is used in `directDepositAlert` in
 *        `./content/directDeposit.jsx`.
 *        Example: "disability compensation, pension, and education"
 * @param {bool|OptionalField} [options.optionalFields.declineDirectDeposit] - Set to true
 *        to add the declineDirectDeposit field the default schema and uiSchema.
 *        Pass an object with schema and uiSchema properties to override either
 *        or both.
 * @param {bool|OptionalField} [options.optionalFields.bankName] - Set to true to add the
 *        bankName field with the default schema and uiSchema. Pass an object
 *        with schema and uiSchema properties to override either or both.
 */
export default ({ affectedBenefits, unaffectedBenefits, optionalFields }) => {
  const optFields = Object.assign({}, defaultOptionalFields, optionalFields);
  return {
    uiSchema: uiSchema({
      affectedBenefits,
      unaffectedBenefits,
      optionalFields: optFields,
    }),
    schema: schema(optFields),
  };
};

export const defaultFieldNames = {
  accountType: 'accountType',
  accountNumber: 'accountNumber',
  routingNumber: 'routingNumber',
  bankName: 'bankName',
};

/**
 * Use this function in the prefillTransformer to move all bank account
 * information into `view:originalBankAccount`. This is useful when using the
 * PaymentView component, which will display either `bankAccount` or
 * `view:originalBankAccount`.
 *
 * @param {object} data - All the pre-filled form data
 * @returns {object} - A new pre-filled form data object after transformation.
 */
export const prefillBankInformation = (
  data,
  prefilledFieldNames = defaultFieldNames,
  postTransformerFieldNames = prefilledFieldNames,
) => {
  // TODO: Add an option for post-transformation field names
  const newData = _.omit(
    [
      prefilledFieldNames.accountType,
      prefilledFieldNames.accountNumber,
      prefilledFieldNames.routingNumber,
      prefilledFieldNames.bankName,
    ],
    data,
  );

  const { accountType, accountNumber, routingNumber, bankName } = data;

  if (accountType && accountNumber && routingNumber && bankName) {
    newData['view:originalBankAccount'] = viewifyFields({
      [postTransformerFieldNames.accountType]: accountType,
      [postTransformerFieldNames.accountNumber]: accountNumber,
      [postTransformerFieldNames.routingNumber]: routingNumber,
      [postTransformerFieldNames.bankName]: bankName,
    });

    // start the bank widget in 'review' mode
    newData.bankAccount = { 'view:hasPrefilledBank': true };
  }

  return newData;
};

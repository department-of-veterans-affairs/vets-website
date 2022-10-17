import React from 'react';
import _ from 'platform/utilities/data';

import bankAccountUI from 'platform/forms/definitions/bankAccount';
import ReviewCardField from '../components/ReviewCardField';
import PaymentView from '../components/PaymentView';
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

const usingDirectDeposit = formData => !formData?.declineDirectDeposit;

// This works because the pre-fill transformer adds it, but when we add new
// data, this will always be absent because it's not an actual field. What's
// more, with `volitileData: true`, hitting cancel will set
// `view:hasPrefilledBank` back to true.
const bankFieldIsRequired = formData =>
  !formData.bankAccount?.['view:hasPrefilledBank'] &&
  usingDirectDeposit(formData);

const uiSchema = ({ affectedBenefits, unaffectedBenefits, optionalFields }) => {
  const ui = {
    'ui:title': ({ formData }) => {
      return formData.declineDirectDeposit ? (
        <div className="schemaform-block-header">
          <legend className="schemaform-block-title" id="root__title">
            Direct deposit information
          </legend>
        </div>
      ) : null;
    },
    'ui:order': [
      'bankAccount',
      'declineDirectDeposit',
      'view:directDepositInfo',
      'view:bankInfoHelpText',
    ],
    bankAccount: {
      'ui:field': ReviewCardField,
      'ui:options': {
        viewComponent: PaymentView,
        classNames: 'vads-u-margin-bottom--3',
        hideIf: form => !usingDirectDeposit(form),
        reviewTitle: 'Direct deposit information',
        editTitle: 'Edit direct deposit information',
        itemName: 'account information',
        itemNameAction: 'Update',
        startInEdit: data => !data?.['view:hasPrefilledBank'],
        volatileData: true,
        ariaLabel: 'Save direct deposit information',
      },
      'ui:order': [
        'view:paymentText',
        'accountType',
        'view:ddDescription',
        'bankName',
        'routingNumber',
        'accountNumber',
      ],
      'view:paymentText': {
        'ui:description': (
          // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
          <div tabIndex="0">
            We make payments only through direct deposit, also called electronic
            funds transfer (EFT).
          </div>
        ),
      },
      accountType: {
        ...bankAccountUI.accountType,
        'ui:required': bankFieldIsRequired,
      },
      'view:ddDescription': {
        'ui:description': directDepositDescription,
      },
      // Optional fields such as bankName are added to the uiSchema here because
      // they'll be ignored if the corresponding property in the schema isn't
      // found.
      bankName: {
        'ui:title': 'Bank name',
      },
      routingNumber: {
        ...bankAccountUI.routingNumber,
        'ui:title': "Bank's 9-digit routing number",
        'ui:required': bankFieldIsRequired,
      },
      accountNumber: {
        ...bankAccountUI.accountNumber,
        'ui:title': 'Bank account number',
        'ui:required': bankFieldIsRequired,
      },
    },
    declineDirectDeposit: {
      'ui:title': 'I don’t want to use direct deposit',
      'ui:options': {
        hideOnReviewIfFalse: true,
        widgetClassNames: 'vads-u-margin-top--4',
      },
    },
    'view:directDepositInfo': {
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
          'view:paymentText': { type: 'object', properties: {} },
          accountType: {
            type: 'string',
            enum: ['checking', 'savings'],
          },
          'view:ddDescription': { type: 'object', properties: {} },
          routingNumber: {
            type: 'string',
            pattern: '^\\d{9}$',
          },
          accountNumber: {
            type: 'string',
          },
        },
      },
      'view:directDepositInfo': { type: 'object', properties: {} },
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
  const optFields = { ...defaultOptionalFields, ...optionalFields };
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
) => {
  const newData = _.omit(
    [
      prefilledFieldNames.accountType,
      prefilledFieldNames.accountNumber,
      prefilledFieldNames.routingNumber,
      prefilledFieldNames.bankName,
    ],
    data,
  );

  const accountType = data[prefilledFieldNames.accountType];
  const accountNumber = data[prefilledFieldNames.accountNumber];
  const routingNumber = data[prefilledFieldNames.routingNumber];
  const bankName = data[prefilledFieldNames.bankName];

  if (accountType && accountNumber && routingNumber && bankName) {
    newData['view:originalBankAccount'] = viewifyFields({
      accountType,
      accountNumber,
      routingNumber,
      bankName,
    });

    // start the bank widget in 'review' mode
    newData.bankAccount = { 'view:hasPrefilledBank': true };
  }

  return newData;
};

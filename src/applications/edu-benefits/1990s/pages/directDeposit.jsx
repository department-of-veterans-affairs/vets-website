import directDeposit from 'platform/forms-system/src/js/definitions/directDeposit';
import { bankInfoHelpText, directDepositAlert } from '../content/directDeposit';

// view:directDeposit comes from ./application.js
const bankFieldIsRequired = form =>
  !form['view:directDeposit'].declineDirectDeposit;
const {
  uiSchema: directDepositUiSchema,
  schema: directDepositSchema,
} = directDeposit({
  optionalFields: { bankName: false, declineDirectDeposit: true },
});

const bankAccountUiSchema = directDepositUiSchema.bankAccount;
export const uiSchema = {
  ...directDepositUiSchema,
  'ui:order': null, // have to null this out and declare properties in correct order
  bankAccount: {
    ...bankAccountUiSchema,
    'ui:order': null, // have to null this out and declare properties in correct order
    'ui:options': {
      ...bankAccountUiSchema['ui:options'],
      hideIf: form => !bankFieldIsRequired(form),
    },
    'view:paymentText': {
      'ui:description':
        'We make payments only through direct deposit, also called electronic funds transfer (EFT). Please provide your direct deposit information below. We’ll send your housing payment to this account.',
    },
    accountType: {
      ...bankAccountUiSchema.accountType,
      'ui:required': bankFieldIsRequired,
    },
    routingNumber: {
      ...bankAccountUiSchema.routingNumber,
      'ui:required': bankFieldIsRequired,
    },
    accountNumber: {
      ...bankAccountUiSchema.accountNumber,
      'ui:required': bankFieldIsRequired,
    },
  },
  declineDirectDeposit: directDepositUiSchema.declineDirectDeposit,
  'view:directDespositInfo': {
    ...directDepositUiSchema['view:directDespositInfo'],
    'ui:description': directDepositAlert,
  },
  'view:bankInfoHelpText': {
    ...directDepositUiSchema['view:bankInfoHelpText'],
    'ui:description': bankInfoHelpText,
  },
};

const bankAccountSchemaProperties =
  directDepositSchema.properties.bankAccount.properties;

export const schema = {
  type: 'object',
  properties: {
    bankAccount: {
      type: 'object',
      properties: {
        'view:paymentText': bankAccountSchemaProperties['view:paymentText'],
        accountType: bankAccountSchemaProperties.accountType,
        'view:ddDescription': bankAccountSchemaProperties['view:ddDescription'],
        routingNumber: bankAccountSchemaProperties.routingNumber,
        accountNumber: bankAccountSchemaProperties.accountNumber,
      },
    },
    declineDirectDeposit: {
      type: 'boolean',
    },
    'view:directDespositInfo':
      directDepositSchema.properties['view:directDespositInfo'],
    'view:bankInfoHelpText':
      directDepositSchema.properties['view:bankInfoHelpText'],
  },
};

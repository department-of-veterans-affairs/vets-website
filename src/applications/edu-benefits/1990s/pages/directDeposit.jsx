import directDeposit from 'platform/forms-system/src/js/definitions/directDeposit';
import { bankInfoHelpText, directDepositAlert } from '../content/directDeposit';
import _ from 'lodash';
import PaymentReviewView from '../components/PaymentReviewView';
import { hasNewBankInformation } from '../utils';
import PaymentView from '../components/PaymentView';

const {
  uiSchema: directDepositUiSchema,
  schema: directDepositSchema,
} = directDeposit({
  optionalFields: { bankName: false, declineDirectDeposit: true },
});

const bankAccountUiSchema = directDepositUiSchema.bankAccount;

// view:directDeposit comes from ./application.js
const bankFieldIsRequired = form =>
  !form['view:directDeposit'].declineDirectDeposit;

const startInEdit = data =>
  !_.get(data, 'view:hasPrefilledBank', false) && !hasNewBankInformation(data);

export const uiSchema = {
  ...directDepositUiSchema,
  'ui:order': null, // have to null this out and declare properties in correct order
  bankAccount: {
    ...bankAccountUiSchema,
    'ui:order': null, // have to null this out and declare properties in correct order
    'ui:options': {
      ...bankAccountUiSchema['ui:options'],
      viewComponent: PaymentView,
      hideIf: form => !bankFieldIsRequired(form),
      startInEdit: data => startInEdit(data),
    },
    'view:paymentText': {
      'ui:description':
        'We make payments only through direct deposit, also called electronic funds transfer (EFT). Please provide your direct deposit information below. We’ll send your housing payment to this account.',
    },
    accountType: {
      ...bankAccountUiSchema.accountType,
      'ui:required': bankFieldIsRequired,
      'ui:reviewWidget': PaymentReviewView,
    },
    routingNumber: {
      ...bankAccountUiSchema.routingNumber,
      'ui:required': bankFieldIsRequired,
      'ui:reviewWidget': PaymentReviewView,
    },
    accountNumber: {
      ...bankAccountUiSchema.accountNumber,
      'ui:required': bankFieldIsRequired,
      'ui:title': 'Bank account number',
      'ui:reviewWidget': PaymentReviewView,
    },
    saveClickTrackEvent: {
      event: 'cta-button-click',
      'button-type': 'primary',
      'button-click-label': 'Save',
      'button-background-color': '#0071BB',
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

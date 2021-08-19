import directDeposit from 'platform/forms-system/src/js/definitions/directDeposit';
import {
  bankInfoHelpText,
  directDepositAlert,
  paymentText,
} from '../content/directDeposit';
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
      'ui:description': paymentText,
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
  'view:directDepositInfo': {
    ...directDepositUiSchema['view:directDepositInfo'],
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
    'view:directDepositInfo':
      directDepositSchema.properties['view:directDepositInfo'],
    'view:bankInfoHelpText':
      directDepositSchema.properties['view:bankInfoHelpText'],
  },
};

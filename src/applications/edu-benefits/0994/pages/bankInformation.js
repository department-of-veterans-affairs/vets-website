import _ from 'lodash';
import fullSchema from 'vets-json-schema/dist/22-0994-schema.json';
import bankAccountUI from 'platform/forms/definitions/bankAccount';
import ReviewCardField from 'platform/forms-system/src/js/components/ReviewCardField';
import { hasNewBankInformation, hasPrefillBankInformation } from '../utils';
import PaymentView from '../components/PaymentView';
import PaymentReviewView from '../components/PaymentReviewView';
import environment from 'platform/utilities/environment';

import {
  bankInfoDescriptionWithInfo,
  bankInfoDescriptionWithoutInfo,
  bankInfoNote,
  bankInfoHelpText,
} from '../content/bankInformation';

const { bankAccount } = fullSchema.properties;

const hasNewBankInfo = formData => {
  const bankAccountObj = _.get(formData['view:bankAccount'], 'bankAccount', {});
  return hasNewBankInformation(bankAccountObj);
};

export const hasPrefillBankInfo = formData => {
  const bankAccountObj = _.get(formData, 'prefillBankAccount', {});
  return hasPrefillBankInformation(bankAccountObj);
};

const startInEdit = data =>
  !_.get(data, 'view:hasBankInformation', false) &&
  !hasNewBankInformation(data.bankAccount);

const newItemName = environment.isProduction()
  ? 'account'
  : 'account information';

export const uiSchema = {
  'ui:title': 'Direct deposit information',
  'view:descriptionWithInfo': {
    'ui:description': bankInfoDescriptionWithInfo,
    'ui:options': {
      hideIf: data => !hasPrefillBankInfo(data) && !hasNewBankInfo(data),
    },
  },
  'view:descriptionWithoutInfo': {
    'ui:description': bankInfoDescriptionWithoutInfo,
    'ui:options': {
      hideIf: data => hasPrefillBankInfo(data) || hasNewBankInfo(data),
    },
  },
  'view:bankAccount': {
    'ui:field': ReviewCardField,
    'ui:options': {
      viewComponent: PaymentView,
      reviewTitle: 'Payment information',
      editTitle: 'Update bank account',
      itemName: newItemName,
      itemNameAction: 'Update',
      startInEdit,
      volatileData: true,
    },
    saveClickTrackEvent: { event: 'edu-0994-bank-account-saved' },
    bankAccount: {
      ...bankAccountUI,
      accountType: {
        ...bankAccountUI.accountType,
        'ui:reviewWidget': PaymentReviewView,
        'ui:errorMessages': {
          required: 'Please choose an account type',
        },
      },
      accountNumber: {
        ...bankAccountUI.accountNumber,
        'ui:reviewWidget': PaymentReviewView,
        'ui:errorMessages': {
          required: 'Please provide a bank account number',
          pattern: 'Please enter a valid account number',
        },
      },
      routingNumber: {
        ...bankAccountUI.routingNumber,
        'ui:reviewWidget': PaymentReviewView,
        'ui:errorMessages': {
          required: 'Please provide a bank routing number',
          pattern: 'Please enter a valid routing number',
        },
      },
    },
  },
  'view:bankInfoNote': {
    'ui:description': bankInfoNote,
  },
  'view:bankInfoHelpText': {
    'ui:description': bankInfoHelpText,
  },
};

export const schema = {
  type: 'object',
  properties: {
    'view:descriptionWithInfo': {
      type: 'object',
      properties: {},
    },
    'view:descriptionWithoutInfo': {
      type: 'object',
      properties: {},
    },
    'view:bankAccount': {
      type: 'object',
      properties: {
        bankAccount,
      },
    },
    'view:bankInfoNote': {
      type: 'object',
      properties: {},
    },
    'view:bankInfoHelpText': {
      type: 'object',
      properties: {},
    },
  },
};

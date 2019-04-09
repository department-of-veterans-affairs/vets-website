import _ from 'lodash';
import fullSchema from 'vets-json-schema/dist/22-0994-schema.json';
import bankAccountUI from '../../../../platform/forms/definitions/bankAccount';
import ReviewCardField from '../../components/ReviewCardField';
import PaymentView from '../components/PaymentView';
import PaymentReviewView from '../components/PaymentReviewView';
import { hasNewBankInformation, hasPrefillBankInformation } from '../utils';

import {
  bankInfoDescriptionWithPrefill,
  bankInfoDescriptionWithoutPrefill,
  bankInfoNote,
  bankInfoHelpText,
} from '../content/bankInformation';

const { bankAccount } = fullSchema.properties;

const hasNewBankInfo = formData => {
  const bankAccountObj = _.get(formData['view:bankAccount'], 'bankAccount', {});
  return hasNewBankInformation(bankAccountObj);
};

const hasPrefillBankInfo = formData => {
  const bankAccountObj = _.get(formData, 'prefillBankAccount', {});
  return hasPrefillBankInformation(bankAccountObj);
};

export const uiSchema = {
  'ui:title': 'Direct deposit information',
  'view:descriptionWithPrefill': {
    'ui:description': bankInfoDescriptionWithPrefill,
    'ui:options': {
      hideIf: data => !hasPrefillBankInfo(data) || hasNewBankInfo(data),
    },
  },
  'view:descriptionWithoutPrefill': {
    'ui:description': bankInfoDescriptionWithoutPrefill,
    'ui:options': {
      hideIf: data => hasPrefillBankInfo(data) && !hasNewBankInfo(data),
    },
  },
  'view:bankAccount': {
    'ui:field': ReviewCardField,
    'ui:options': {
      viewComponent: PaymentView,
      reviewTitle: 'Payment information',
      editTitle: 'Update bank account',
      itemName: 'account',
      itemNameAction: 'Update',
      startInEdit: data =>
        !hasPrefillBankInfo(data) && !hasNewBankInformation(data),
      volatileData: true,
    },
    saveClickTrackEvent: { event: 'edu-0994-bank-account-saved' },
    bankAccount: {
      ...bankAccountUI,
      accountType: {
        ...bankAccountUI.accountType,
        'ui:reviewWidget': PaymentReviewView,
      },
      accountNumber: {
        ...bankAccountUI.accountNumber,
        'ui:reviewWidget': PaymentReviewView,
      },
      routingNumber: {
        ...bankAccountUI.routingNumber,
        'ui:reviewWidget': PaymentReviewView,
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
    'view:descriptionWithPrefill': {
      type: 'object',
      properties: {},
    },
    'view:descriptionWithoutPrefill': {
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

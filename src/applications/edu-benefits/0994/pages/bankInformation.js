import fullSchema from 'vets-json-schema/dist/22-0994-schema.json';
import bankAccountUI from '../../../../platform/forms/definitions/bankAccount';
import ReviewCardField from '../../components/ReviewCardField';
import PaymentView from '../components/PaymentView';
import PaymentReviewView from '../components/PaymentReviewView';

import {
  bankInfoTitle,
  bankInfoDescription,
  bankInfoNote,
  bankInfoHelpText,
} from '../content/bankInformation';

const { bankAccount } = fullSchema.properties;

export const uiSchema = {
  'ui:title': bankInfoTitle,
  'ui:description': bankInfoDescription,
  'view:bankAccount': {
    'ui:field': ReviewCardField,
    'ui:options': {
      viewComponent: PaymentView,
      reviewTitle: 'Payment information',
      editTitle: 'Add new bank account',
      itemName: 'account',
      startInEdit: data => !data['view:hasBankInformation'],
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
    'ui:title': ' ',
    'ui:description': bankInfoNote,
  },
  'view:bankInfoHelpText': {
    'ui:title': ' ',
    'ui:description': bankInfoHelpText,
  },
};

export const schema = {
  type: 'object',
  properties: {
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

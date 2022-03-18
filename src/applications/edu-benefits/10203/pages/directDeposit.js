import fullSchema10203 from 'vets-json-schema/dist/22-10203-schema.json';
import bankAccountUI from 'platform/forms/definitions/bankAccount';
import {
  directDepositDescription,
  bankInfoHelpText,
  directDepositAlert,
} from '../content/directDeposit';

const { declineDirectDeposit } = fullSchema10203.properties;
const { bankAccount } = fullSchema10203.definitions;

const useDirectDeposit = form => !form?.declineDirectDeposit;

export const uiSchema = {
  'ui:title': 'Direct deposit',
  'ui:description': directDepositDescription,
  bankAccount: {
    'ui:order': ['accountType', 'routingNumber', 'accountNumber'],
    accountType: {
      ...bankAccountUI.accountType,
      'ui:required': useDirectDeposit,
    },
    routingNumber: {
      ...bankAccountUI.routingNumber,
      'ui:title': 'Bank’s 9-digit routing number',
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
  'view:directDepositInfo': {
    'ui:description': directDepositAlert,
  },
  'view:bankInfoHelpText': {
    'ui:description': bankInfoHelpText,
    'ui:options': {
      classNames: 'vads-u-margin-top--4',
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    bankAccount,
    declineDirectDeposit,
    'view:directDepositInfo': {
      type: 'object',
      properties: {},
    },
    'view:bankInfoHelpText': {
      type: 'object',
      properties: {},
    },
  },
};

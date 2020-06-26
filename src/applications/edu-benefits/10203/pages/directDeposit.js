import fullSchema10203 from 'vets-json-schema/dist/22-10203-schema.json';
import bankAccountUI from 'platform/forms/definitions/bankAccount';
import { directDepositDescription } from '../content/directDeposit';
import { bankInfoHelpText } from '../../0994/content/bankInformation';

const { declineDirectDeposit } = fullSchema10203.properties;
const { bankAccount } = fullSchema10203.definitions;

const useDirectDeposit = form => !form?.declineDirectDeposit;

export const uiSchema = {
  'ui:title': 'Direct deposit',
  'ui:description': directDepositDescription,
  bankAccount: {
    ...bankAccountUI,
    accountType: {
      ...bankAccountUI.accountType,
      'ui:required': useDirectDeposit,
    },
    accountNumber: {
      ...bankAccountUI.accountNumber,
      'ui:required': useDirectDeposit,
    },
    routingNumber: {
      ...bankAccountUI.routingNumber,
      'ui:required': useDirectDeposit,
    },
    'ui:options': {
      classNames: 'vads-u-margin-bottom--3',
    },
  },
  declineDirectDeposit: {
    'ui:title': "I don't want to use direct deposit",
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
    'view:bankInfoHelpText': {
      type: 'object',
      properties: {},
    },
  },
};

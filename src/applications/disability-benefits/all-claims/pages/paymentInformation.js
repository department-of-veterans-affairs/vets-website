import fullSchema from '../config/schema';
import { bankFieldsHaveInput } from '../utils';

const {
  bankAccountType,
  bankAccountNumber,
  bankRoutingNumber,
  bankName,
} = fullSchema.properties;

export const uiSchema = {
  'ui:title': 'Payment information',
  'ui:description':
    'This is the bank account information we have on file for you. We’ll pay your disability benefit to this account.',
  bankAccountType: {
    'ui:title': 'Account type',
    'ui:options': {
      widgetClassNames: 'va-select-medium-large',
    },
    'ui:required': bankFieldsHaveInput,
  },
  bankAccountNumber: {
    'ui:title': 'Account number',
    'ui:options': {
      widgetClassNames: 'va-input-medium-large',
    },
    'ui:required': bankFieldsHaveInput,
  },
  bankRoutingNumber: {
    'ui:title': 'Routing number',
    'ui:errorMessages': {
      pattern: 'Routing number must be 9 digits',
    },
    'ui:options': {
      widgetClassNames: 'va-input-medium-large',
    },
    'ui:required': bankFieldsHaveInput,
  },
  bankName: {
    'ui:title': 'Bank name',
    'ui:required': bankFieldsHaveInput,
  },
};

export const schema = {
  type: 'object',
  properties: {
    bankAccountType,
    bankAccountNumber,
    bankRoutingNumber,
    bankName,
  },
};

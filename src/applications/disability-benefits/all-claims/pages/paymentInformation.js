import fullSchema from '../config/schema';

const {
  accountType,
  accountNumber,
  routingNumber,
  bankName,
} = fullSchema.properties;

export const uiSchema = {
  'ui:title': 'Payment information',
  'ui:description':
    'This is the bank account information we have on file for you. We’ll pay your disability benefit to this account.',
  accountType: {
    'ui:title': 'Account type',
    'ui:options': {
      widgetClassNames: 'va-select-medium-large',
    },
  },
  accountNumber: {
    'ui:title': 'Account number',
    'ui:options': {
      widgetClassNames: 'va-input-medium-large',
    },
  },
  routingNumber: {
    'ui:title': 'Routing number',
    'ui:errorMessages': {
      pattern: 'Routing number must be 9 digits',
    },
    'ui:options': {
      widgetClassNames: 'va-input-medium-large',
    },
  },
  bankName: {
    'ui:title': 'Bank name',
  },
};

export const schema = {
  type: 'object',
  required: ['accountType', 'accountNumber', 'routingNumber', 'bankName'],
  properties: {
    accountType,
    accountNumber,
    routingNumber,
    bankName,
  },
};

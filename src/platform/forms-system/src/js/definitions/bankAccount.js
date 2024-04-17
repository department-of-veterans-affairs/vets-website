import { validateRoutingNumber } from '../validation';

const uiSchema = {
  'ui:order': ['accountType', 'accountNumber', 'routingNumber'],
  accountType: {
    'ui:title': 'Account type',
    'ui:widget': 'radio',
    'ui:options': {
      labels: {
        checking: 'Checking',
        savings: 'Savings',
      },
    },
  },
  accountNumber: {
    'ui:title': 'Bank account number',
  },
  routingNumber: {
    'ui:title': 'Bank routing number',
    'ui:validations': [validateRoutingNumber],
    'ui:errorMessages': {
      pattern: 'Enter a valid nine digit routing number',
      required: 'Enter a routing number',
    },
  },
};

export default uiSchema;

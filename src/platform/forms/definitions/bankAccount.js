import { isValidRoutingNumber } from '../validations';

function validateRoutingNumber(
  errors,
  routingNumber,
  formData,
  schema,
  errorMessages,
) {
  if (!isValidRoutingNumber(routingNumber)) {
    errors.addError(errorMessages.pattern);
  }
}

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
    'ui:title': 'Account number',
  },
  routingNumber: {
    'ui:title': 'Routing number',
    'ui:validations': [validateRoutingNumber],
    'ui:errorMessages': {
      pattern: 'Please enter a valid nine digit routing number',
    },
  },
};

export default uiSchema;

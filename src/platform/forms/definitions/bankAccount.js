import { isValidRoutingNumber } from '../validations';
import { directDepositDescription } from '../../forms-system/src/js/definitions/content/directDeposit';
import environment from 'platform/utilities/environment';

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
  'ui:order': () =>
    environment.isProduction()
      ? ['accountType', 'accountNumber', 'routingNumber']
      : ['accountType', 'view:ddDescription', 'routingNumber', 'accountNumber'],
  accountType: {
    'ui:title': 'Account type',
    'ui:widget': 'radio',
    'ui:required': () => !environment.isProduction(),
    'ui:options': {
      labels: {
        checking: 'Checking',
        savings: 'Savings',
      },
    },
  },
  'view:ddDescription': {
    'ui:description': directDepositDescription,
  },
  accountNumber: {
    'ui:title': 'Bank account number',
    'ui:required': () => !environment.isProduction(),
    'ui:errorMessages': () =>
      environment.isProduction()
        ? {}
        : {
            pattern: 'Please enter a valid account number',
            required: 'Please enter a bank account number',
          },
  },
  routingNumber: {
    'ui:title': environment.isProduction()
      ? 'Bank routing number'
      : 'Bank’s 9 digit routing number',
    'ui:validations': [validateRoutingNumber],
    'ui:required': () => !environment.isProduction(),
    'ui:errorMessages': () =>
      environment.isProduction()
        ? {}
        : {
            pattern: 'Please enter a valid 9 digit routing number',
            required: 'Please enter a routing number',
          },
  },
};

export default uiSchema;

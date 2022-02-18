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

const isProduction = environment.isProduction();

const uiSchema = {
  'ui:order': () =>
    isProduction
      ? ['accountType', 'accountNumber', 'routingNumber']
      : ['accountType', 'routingNumber', 'accountNumber'],
  accountType: {
    'ui:title': 'Account type',
    'ui:widget': 'radio',
    'ui:required': !environment.isProduction,
    'ui:options': {
      labels: {
        checking: 'Checking',
        savings: 'Savings',
      },
    },
  },
  accountNumber: {
    'ui:title': 'Bank account number',
    'ui:required': !environment.isProduction,
    'ui:errorMessages': () =>
      isProduction
        ? {}
        : {
            pattern: 'Please enter a valid account number',
            required: 'Please enter a bank account number',
          },
  },
  routingNumber: {
    'ui:title': isProduction
      ? 'Bank routing number'
      : 'Bank’s 9 digit routing number',
    'ui:validations': [validateRoutingNumber],
    'ui:required': !environment.isProduction,
    'ui:errorMessages': () =>
      isProduction
        ? {}
        : {
            pattern: 'Please enter a valid 9 digit routing number',
            required: 'Please enter a routing number',
          },
  },
};

export default uiSchema;

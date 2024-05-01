import { isValidRoutingNumber } from 'platform/forms/validations';
import merge from 'lodash/merge';
import DirectDepositDescription from '../components/ShowDirectDepositDropdown';

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

export default function createDirectDepositPage() {
  const bankAccountProperties = {
    type: 'object',
    properties: {
      accountType: {
        type: 'string',
        enum: ['checking', 'savings'],
      },
      routingNumber: {
        type: 'string',
        pattern: '^\\d{9}$',
      },
      accountNumber: {
        type: 'string',
      },
      'view:bankInfoHelpText': {
        type: 'object',
        properties: {},
      },
    },
  };

  return {
    title: 'Direct deposit',
    path: 'personal-information/direct-deposit',
    initialData: {},
    uiSchema: {
      'ui:title': 'Direct deposit',
      'ui:description': DirectDepositDescription,
      bankAccount: merge(
        {},
        {
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
              pattern: 'Please enter a valid 9 digit routing number',
            },
          },
        },
      ),
    },
    schema: {
      type: 'object',
      properties: {
        bankAccount: bankAccountProperties,
      },
    },
  };
}

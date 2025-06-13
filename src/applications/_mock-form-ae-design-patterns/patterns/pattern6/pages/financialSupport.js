import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';

export default {
  uiSchema: {
    ...titleUI('Financial Support'),
    providedFinancialSupport: {
      'ui:title':
        'Did you provide any financial support for your spouse in the last year?',
      'ui:widget': 'yesNo',
      'ui:options': {
        labels: {
          Y: 'Yes',
          N: 'No',
        },
      },
    },
    financialSupportDetails: {
      'ui:options': {
        expandUnder: 'providedFinancialSupport',
        expandUnderCondition: true,
      },
      supportAmount: {
        'ui:title': 'How much?',
        'ui:prefix': '$',
        'ui:webComponentField': VaTextInputField,
        'ui:validations': [
          {
            validator: (errors, field) => {
              if (!/^\d+(\.\d{1,2})?$/.test(field) && field) {
                errors.addError('Please enter a valid dollar amount');
              }
            },
          },
        ],
      },
    },
  },
  schema: {
    type: 'object',
    required: ['providedFinancialSupport'],
    properties: {
      providedFinancialSupport: {
        type: 'boolean',
      },
      financialSupportDetails: {
        type: 'object',
        properties: {
          supportAmount: {
            type: 'string',
          },
        },
      },
    },
  },
};

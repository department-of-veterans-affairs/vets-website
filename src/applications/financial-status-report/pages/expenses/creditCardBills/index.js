export const uiSchema = {
  'ui:title': 'Credit card bills',
  questions: {
    hasCreditCardBills: {
      'ui:title': 'Do you have any past-due credit card bills?',
      'ui:widget': 'yesNo',
      'ui:required': () => true,
      'ui:errorMessages': {
        required: 'Please enter your credit card bill information.',
      },
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    questions: {
      type: 'object',
      properties: {
        hasCreditCardBills: {
          type: 'boolean',
        },
      },
    },
  },
};

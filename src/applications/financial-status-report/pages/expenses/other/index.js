export const uiSchema = {
  'ui:title': 'Other living expenses',
  questions: {
    hasOtherExpenses: {
      'ui:title':
        'Do you have any other living expenses (like clothing, transportation, child care, or health care costs)?',
      'ui:widget': 'yesNo',
      'ui:required': () => true,
      'ui:errorMessages': {
        required: 'Please select a response.',
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
        hasOtherExpenses: {
          type: 'boolean',
        },
      },
    },
  },
};

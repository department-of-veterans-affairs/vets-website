export const uiSchema = {
  'ui:title': 'Your monthly utility bills',
  questions: {
    hasUtilities: {
      'ui:title':
        'Do you pay any monthly utility bills (like water, electricity, or gas)?',
      'ui:required': () => true,
      'ui:widget': 'yesNo',
      'ui:options': {
        classNames: 'no-wrap',
      },
      'ui:errorMessages': {
        required: 'Please provide your utility bill information.',
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
        hasUtilities: {
          type: 'boolean',
        },
      },
    },
  },
};

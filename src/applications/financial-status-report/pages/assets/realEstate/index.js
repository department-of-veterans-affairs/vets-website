export const uiSchema = {
  'ui:title': 'Your real estate assets',
  questions: {
    hasRealEstate: {
      'ui:title': 'Do you currently own any real estate?',
      'ui:widget': 'yesNo',
      'ui:required': () => true,
      'ui:errorMessages': {
        required: 'Please enter your real estate information.',
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
        hasRealEstate: {
          type: 'boolean',
        },
      },
    },
  },
};

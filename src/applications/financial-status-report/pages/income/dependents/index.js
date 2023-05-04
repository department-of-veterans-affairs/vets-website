export const uiSchema = {
  'ui:title': 'Your dependents',
  questions: {
    hasDependents: {
      'ui:title':
        'Do you have any dependents who rely on you for financial support?',
      'ui:widget': 'yesNo',
      'ui:required': () => true,
      'ui:options': {
        classNames: 'no-wrap',
      },
      'ui:errorMessages': {
        required: 'Please enter your dependent(s) information.',
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
        hasDependents: {
          type: 'boolean',
        },
      },
    },
  },
};

export const uiSchemaEnhanced = {
  'ui:title': 'Your dependents',
  questions: {
    'ui:options': {
      hideOnReview: true, // change this to true to hide this question on review page
    },
    hasDependents: {
      'ui:title':
        'How many dependents do you have who rely on you for financial support?',
      'ui:widget': 'TextWidget',
      'ui:required': () => true,
      'ui:options': {
        classNames: 'no-wrap input-size-2',
      },
      'ui:errorMessages': {
        required: 'Please enter your dependent(s) information.',
      },
    },
  },
};

export const schemaEnhanced = {
  type: 'object',
  properties: {
    questions: {
      type: 'object',
      properties: {
        hasDependents: {
          type: 'string',
        },
      },
    },
  },
};

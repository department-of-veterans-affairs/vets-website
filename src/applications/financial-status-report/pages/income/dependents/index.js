export const uiSchema = {
  'ui:title': 'Your dependents',
  income: {
    hasDependents: {
      'ui:title':
        'Do you have any dependents who rely on you for financial support?',
      'ui:widget': 'yesNo',
      'ui:required': () => true,
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    income: {
      type: 'object',
      properties: {
        hasDependents: {
          type: 'boolean',
        },
      },
    },
  },
};

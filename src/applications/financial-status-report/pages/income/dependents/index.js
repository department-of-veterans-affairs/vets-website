export const uiSchema = {
  'ui:title': 'Your dependents',
  dependents: {
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
    dependents: {
      type: 'object',
      properties: {
        hasDependents: {
          type: 'boolean',
        },
      },
    },
  },
};

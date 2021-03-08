export const uiSchema = {
  'ui:title': 'Your dependents',
  personalData: {
    hasDependents: {
      'ui:title':
        'Do you have any dependents who rely on you for financial support?',
      'ui:widget': 'yesNo',
      'ui:required': () => true,
      'ui:options': {
        classNames: 'no-wrap',
      },
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    personalData: {
      type: 'object',
      properties: {
        hasDependents: {
          type: 'boolean',
        },
      },
    },
  },
};

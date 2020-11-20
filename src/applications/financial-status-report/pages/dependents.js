export const uiSchema = {
  dependentsSection: {
    'ui:title': 'Your employment history',
    dependents: {
      'ui:title': 'Do you have any dependents?',
      'ui:widget': 'yesNo',
      'ui:required': () => true,
    },
    hasDependents: {
      'ui:options': {
        expandUnder: 'dependents',
      },
      dependentAge: {
        'ui:title': 'Dependent Age',
      },
    },
  },
};
export const schema = {
  type: 'object',
  properties: {
    dependentsSection: {
      type: 'object',
      properties: {
        dependents: {
          type: 'boolean',
        },
        hasDependents: {
          type: 'object',
          properties: {
            dependentAge: {
              type: 'number',
            },
          },
        },
      },
    },
  },
};

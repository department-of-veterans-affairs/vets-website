export const uiSchema = {
  dependantsSection: {
    'ui:title': 'Your employment history',
    dependants: {
      'ui:title': 'Do you have any dependents?',
      'ui:widget': 'yesNo',
      'ui:required': () => true,
    },
    hasDependents: {
      'ui:options': {
        expandUnder: 'dependants',
      },
      dependantAge: {
        type: 'number',
      },
    },
  },
};
export const schema = {
  type: 'object',
  properties: {
    dependantsSection: {
      type: 'object',
      properties: {
        dependants: {
          type: 'boolean',
        },
        hasDependents: {
          type: 'object',
          properties: {
            type: 'object',
            dependantAge: {
              type: 'string',
            },
          },
        },
      },
    },
  },
};

export const uiSchema = {
  'ui:title': 'Your spouse information',
  questions: {
    spouseHasSocialSecurity: {
      'ui:title': 'Does your spouse currently get Social Security payments?',
      'ui:widget': 'yesNo',
      'ui:required': () => true,
      'ui:options': {
        classNames: 'no-wrap',
      },
      'ui:errorMessages': {
        required:
          'Please enter your spouse’s Social Security benefits information.',
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
        spouseHasSocialSecurity: {
          type: 'boolean',
        },
      },
    },
  },
};

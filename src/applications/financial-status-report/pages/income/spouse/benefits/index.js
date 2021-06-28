export const uiSchema = {
  'ui:title': 'Your spouse information',
  questions: {
    spouseHasBenefits: {
      'ui:title': 'Does your spouse get VA benefits?',
      'ui:widget': 'yesNo',
      'ui:required': () => true,
      'ui:errorMessages': {
        required: 'Please enter your spouse’s VA benefits information.',
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
        spouseHasBenefits: {
          type: 'boolean',
        },
      },
    },
  },
};

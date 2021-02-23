export const uiSchema = {
  'ui:title': 'Your spouse information',
  benefits: {
    spouseHasBenefits: {
      'ui:title': 'Does your spouse get VA benefits?',
      'ui:widget': 'yesNo',
      'ui:required': () => true,
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    benefits: {
      type: 'object',
      properties: {
        spouseHasBenefits: {
          type: 'boolean',
        },
      },
    },
  },
};

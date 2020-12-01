export const uiSchema = {
  'ui:title': 'Your spouse information',
  spouseBenefits: {
    hasBenefits: {
      'ui:title': 'Does your spouse currently receive VA benefits?',
      'ui:widget': 'yesNo',
      'ui:required': () => true,
    },
    benefitType: {
      'ui:options': {
        expandUnder: 'hasBenefits',
      },
      compBenefits: {
        'ui:title':
          'What is the monthly amount your spouse receives for compensation and pension benefits?',
        'ui:required': () => true,
      },
      eduBenefits: {
        'ui:title':
          'What is the monthly amount your spouse receives for education benefits?',
        'ui:required': () => true,
      },
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    spouseBenefits: {
      type: 'object',
      properties: {
        hasBenefits: {
          type: 'boolean',
        },
        benefitType: {
          type: 'object',
          properties: {
            compBenefits: {
              type: 'number',
            },
            eduBenefits: {
              type: 'number',
            },
          },
        },
      },
    },
  },
};

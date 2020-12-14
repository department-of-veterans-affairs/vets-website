import currencyUI from 'platform/forms-system/src/js/definitions/currency';

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
      compBenefits: currencyUI(
        'What is the monthly amount your spouse receives for compensation and pension benefits?',
      ),
      eduBenefits: currencyUI(
        'What is the monthly amount your spouse receives for education benefits?',
      ),
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

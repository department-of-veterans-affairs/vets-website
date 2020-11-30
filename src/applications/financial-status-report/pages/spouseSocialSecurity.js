export const uiSchema = {
  'ui:title': 'Your spouse information',
  spouseSocialSecurity: {
    hasSocialSecurity: {
      'ui:title':
        'Does your spouse currently receive Social Security payments?',
      'ui:widget': 'yesNo',
      'ui:required': () => true,
    },
    monthlyAmount: {
      'ui:options': {
        expandUnder: 'hasSocialSecurity',
      },
      'ui:title':
        'How much does your spouse receive for Social Security each month?',
      'ui:required': () => true,
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    spouseSocialSecurity: {
      type: 'object',
      properties: {
        hasSocialSecurity: {
          type: 'boolean',
        },
        monthlyAmount: {
          type: 'number',
        },
      },
    },
  },
};

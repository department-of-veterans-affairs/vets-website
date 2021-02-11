export const uiSchema = {
  'ui:title': 'Your spouse information',
  socialSecurity: {
    spouse: {
      hasSocialSecurityPayments: {
        'ui:title': 'Does your spouse currently get Social Security payments?',
        'ui:widget': 'yesNo',
        'ui:required': () => true,
      },
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    socialSecurity: {
      type: 'object',
      properties: {
        spouse: {
          type: 'object',
          properties: {
            hasSocialSecurityPayments: {
              type: 'boolean',
            },
          },
        },
      },
    },
  },
};

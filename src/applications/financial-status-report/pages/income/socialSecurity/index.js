export const uiSchema = {
  'ui:title': 'Your other income',
  socialSecurity: {
    hasSocialSecurityPayments: {
      'ui:title': 'Do you get Social Security payments?',
      'ui:widget': 'yesNo',
      'ui:required': () => true,
    },
  },
};
export const schema = {
  type: 'object',
  properties: {
    socialSecurity: {
      type: 'object',
      properties: {
        hasSocialSecurityPayments: {
          type: 'boolean',
        },
      },
    },
  },
};

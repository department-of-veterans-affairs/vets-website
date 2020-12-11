export const uiSchema = {
  'ui:title': 'Your other income',
  additionalIncome: {
    hasSocialSecurityPayments: {
      'ui:title': 'Do you currently receive social security payments?',
      'ui:widget': 'yesNo',
      'ui:required': () => true,
    },
    socialSecurityPayments: {
      'ui:title': 'How much do you receive for Social Security each month?',
      'ui:options': {
        expandUnder: 'hasSocialSecurityPayments',
      },
    },
  },
};
export const schema = {
  type: 'object',
  properties: {
    additionalIncome: {
      type: 'object',
      properties: {
        hasSocialSecurityPayments: {
          type: 'boolean',
        },
        socialSecurityPayments: {
          type: 'string',
        },
      },
    },
  },
};

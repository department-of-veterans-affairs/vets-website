import currencyUI from 'platform/forms-system/src/js/definitions/currency';

export const uiSchema = {
  'ui:title': 'Your other income',
  additionalIncome: {
    hasSocialSecurityPayments: {
      'ui:title': 'Do you currently receive social security payments?',
      'ui:widget': 'yesNo',
      'ui:required': () => true,
    },
    socialSecurity: {
      'ui:options': {
        expandUnder: 'hasSocialSecurityPayments',
      },
      socialSecurityAmount: currencyUI(
        'How much do you receive for Social Security each month?',
      ),
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
        socialSecurity: {
          type: 'object',
          properties: {
            socialSecurityAmount: {
              type: 'number',
            },
          },
        },
      },
    },
  },
};

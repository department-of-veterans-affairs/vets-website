export const uiSchema = {
  'ui:title': 'Your other income',
  income: {
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
    income: {
      type: 'object',
      properties: {
        hasSocialSecurityPayments: {
          type: 'boolean',
        },
      },
    },
  },
};

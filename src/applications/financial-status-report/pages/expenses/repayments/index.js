export const uiSchema = {
  'ui:title': 'Your installment contracts and other debts',
  hasRepayments: {
    'ui:title':
      'Do you pay monthly for any installment contracts or other debts, such as recurring payments for purchases or loan repayment plans?',
    'ui:required': () => true,
    'ui:widget': 'yesNo',
    'ui:options': {
      classNames: 'max-width-400',
    },
  },
};
export const schema = {
  type: 'object',
  properties: {
    hasRepayments: {
      type: 'boolean',
    },
  },
};

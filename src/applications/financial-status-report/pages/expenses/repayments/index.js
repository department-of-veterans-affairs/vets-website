export const uiSchema = {
  'ui:title': 'Your installment contracts and other debts',
  'ui:options': {
    classNames: 'repayments',
  },
  questions: {
    hasRepayments: {
      'ui:title':
        'Do you make monthly payments on any installments contracts or other debts (like loans, purchase payment agreements, or credit card debt)?',
      'ui:required': () => true,
      'ui:widget': 'yesNo',
      'ui:options': {
        classNames: 'max-width-400',
      },
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    questions: {
      type: 'object',
      properties: {
        hasRepayments: {
          type: 'boolean',
        },
      },
    },
  },
};

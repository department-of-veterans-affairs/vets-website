export const uiSchema = {
  'ui:title': 'Your installment contracts and other debts',
  questions: {
    hasRepayments: {
      'ui:title':
        'Do you make monthly payments on any installments contracts or other debts (like loans, purchase payment agreements, or credit card debt)?',
      'ui:required': () => true,
      'ui:widget': 'yesNo',
      'ui:options': {
        classNames: 'max-width-400',
      },
      'ui:errorMessages': {
        required:
          'Please provide your installment contracts or other debts information.',
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

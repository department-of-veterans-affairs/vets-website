export const uiSchema = {
  'ui:title': 'Your installment contracts and other debts',
  hasRepayments: {
    'ui:title':
      'Do you pay monthly for any installment contracts or other debts, such as recurring payments for purchases or loan repayment plans?',
    'ui:required': () => true,
    'ui:widget': 'radio',
  },
};
export const schema = {
  type: 'object',
  properties: {
    hasRepayments: {
      type: 'string',
      enum: [
        'Yes, I have installment contracts or other debts.',
        "No, I don't have installment contracts or other debts.",
      ],
    },
  },
};

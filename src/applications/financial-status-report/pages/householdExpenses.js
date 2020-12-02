export const uiSchema = {
  'ui:title': 'Your monthly household expenses',
  householdExpenses: {
    housingExpense: {
      'ui:title':
        'How much do you spend on housing each month? Please include expenses such as rent, mortgage, taxes, and HOA fees',
      'ui:required': () => true,
    },
    foodExpense: {
      'ui:title': 'How much do you pay for food each month?',
      'ui:required': () => true,
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    householdExpenses: {
      type: 'object',
      properties: {
        housingExpense: {
          type: 'number',
        },
        foodExpense: {
          type: 'number',
        },
      },
    },
  },
};

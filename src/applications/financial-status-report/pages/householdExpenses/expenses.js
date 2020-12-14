import currencyUI from 'platform/forms-system/src/js/definitions/currency';

export const uiSchema = {
  'ui:title': 'Your monthly household expenses',
  expenses: {
    housingExpense: currencyUI(
      'How much do you spend on housing each month? Please include expenses such as rent, mortgage, taxes, and HOA fees',
    ),
    foodExpense: currencyUI('How much do you pay for food each month?'),
  },
};

export const schema = {
  type: 'object',
  properties: {
    expenses: {
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

import currencyUI from 'platform/forms-system/src/js/definitions/currency';
import _ from 'lodash/fp';

export const uiSchema = {
  'ui:title': 'Your monthly household expenses',
  expenses: {
    housingExpense: _.merge(
      currencyUI(
        'How much do you spend on housing each month? Please include expenses such as rent, mortgage, taxes, and HOA fees.',
      ),
      {
        'ui:options': {
          widgetClassNames: 'input-size-3',
        },
      },
    ),
    foodExpense: _.merge(
      currencyUI('How much do you pay for food each month?'),
      {
        'ui:options': {
          widgetClassNames: 'input-size-3',
        },
      },
    ),
  },
};

export const schema = {
  type: 'object',
  properties: {
    expenses: {
      type: 'object',
      required: ['housingExpense', 'foodExpense'],
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

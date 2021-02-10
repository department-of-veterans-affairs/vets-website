import currencyUI from 'platform/forms-system/src/js/definitions/currency';
import _ from 'lodash/fp';

export const uiSchema = {
  'ui:title': 'Your household assets',
  householdAssets: {
    checkingAndSavings: _.merge(
      currencyUI('What is the amount in your checking and savings account?'),
      {
        'ui:options': {
          widgetClassNames: 'input-size-3',
        },
      },
    ),
    availableAssets: _.merge(
      currencyUI('What is the amount of cash you have available?'),
      {
        'ui:options': {
          widgetClassNames: 'input-size-3',
        },
      },
    ),
    savingsBonds: _.merge(
      currencyUI('What is the current value of your U.S. Savings Bonds?'),
      {
        'ui:options': {
          widgetClassNames: 'input-size-3',
        },
      },
    ),
    stocksAndOtherBonds: _.merge(
      currencyUI('What is the current value of your stocks and other bonds?'),
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
    householdAssets: {
      type: 'object',
      required: [
        'checkingAndSavings',
        'availableAssets',
        'savingsBonds',
        'stocksAndOtherBonds',
      ],
      properties: {
        checkingAndSavings: {
          type: 'number',
        },
        availableAssets: {
          type: 'number',
        },
        savingsBonds: {
          type: 'number',
        },
        stocksAndOtherBonds: {
          type: 'number',
        },
      },
    },
  },
};

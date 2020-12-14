import currencyUI from 'platform/forms-system/src/js/definitions/currency';

export const uiSchema = {
  'ui:title': 'Your household assets',
  householdAssets: {
    checkingAndSavings: currencyUI(
      'What is the total amount in your checking and savings account(s)?',
    ),
    availableAssets: currencyUI(
      'What is the total amount of cash you have available?',
    ),
    savingsBonds: currencyUI(
      'What is the total current value of your U.S. Savings Bonds?',
    ),
    stocksAndOtherBonds: currencyUI(
      'What is the total current value of your stocks and other bonds?',
    ),
  },
};

export const schema = {
  type: 'object',
  properties: {
    householdAssets: {
      type: 'object',
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

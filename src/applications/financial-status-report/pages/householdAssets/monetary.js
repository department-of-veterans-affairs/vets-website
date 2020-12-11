export const uiSchema = {
  'ui:title': 'Your household assets',
  householdAssets: {
    checkingAndSavings: {
      'ui:title':
        'What is the total amount in your checking and savings account(s)?',
      'ui:required': () => true,
    },
    availableAssets: {
      'ui:title': 'What is the total amount of cash you have available?',
      'ui:required': () => true,
    },
    savingsBonds: {
      'ui:title':
        'What is the total current value of your U.S. Savings Bonds??',
      'ui:required': () => true,
    },
    stocksAndOtherBonds: {
      'ui:title':
        'What is the total current value of your stocks and other bonds?',
      'ui:required': () => true,
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    householdAssets: {
      type: 'object',
      properties: {
        checkingAndSavings: {
          type: 'string',
        },
        availableAssets: {
          type: 'string',
        },
        savingsBonds: {
          type: 'string',
        },
        stocksAndOtherBonds: {
          type: 'string',
        },
      },
    },
  },
};

export const uiSchema = {
  householdAssets: {
    'ui:title': 'Your household assets',
    checkingAndSavings: {
      'ui:title':
        'What is the total amount in your checking and savings account(s)?',
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
      },
    },
  },
};

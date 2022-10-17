const checkboxGroupPattern = {
  title: 'Section Title: Checkbox group pattern',
  path: 'checkbox-group-pattern',
  uiSchema: {
    checkboxGroupPatternExample: {
      'ui:title': 'Page title: Which books have you read?',
      'ui:description': 'You may check more than one.',
      hasReadPrideAndPrejudice: {
        'ui:title': 'Pride and Prejudice by Jane Austen',
      },
      hasReadJaneEyre: {
        'ui:title': 'Jane Eyre by Charlotte Brontë',
      },
      hasReadGreatGatsby: {
        'ui:title': 'The Great Gatsby by F. Scott Fitzgerald',
      },
      hasReadBuddenbrooks: {
        'ui:title': 'Buddenbrooks by Thomas Mann',
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      checkboxGroupPatternExample: {
        type: 'object',
        properties: {
          hasReadPrideAndPrejudice: { type: 'boolean' },
          hasReadJaneEyre: { type: 'boolean' },
          hasReadGreatGatsby: { type: 'boolean' },
          hasReadBuddenbrooks: { type: 'boolean' },
        },
      },
    },
  },
};

export default checkboxGroupPattern;

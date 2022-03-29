const availableFeaturesAndUsageChapter = {
  title: 'Chapter Title: Available features and usage guidelines examples',
  pages: {
    radioButtonGroup: {
      title: 'Section Title: Radio button group example',
      path: 'radio-button-group',
      uiSchema: {
        radioButtonGroupExample: {
          'ui:widget': 'radio',
          'ui:options': {
            labels: {
              dog: 'Dog',
              cat: 'Cat',
              octopus: 'Octopus',
              sloth: 'Sloth',
            },
            widgetProps: {
              dog: { 'data-info': 'dog_1' },
              cat: { 'data-info': 'cat_2' },
              octopus: { 'data-info': 'octopus_3' },
              sloth: { 'data-info': 'sloth_4' },
            },
            // Only added to the radio when it is selected
            // a11y requirement: aria-describedby ID's *must* exist on the page; and we
            // conditionally add content based on the selection
            selectedProps: {
              // dog: { 'aria-describedby': 'some_id_1' },
              // cat: { 'aria-describedby': 'some_id_2' },
              // octopus: { 'aria-describedby': 'some_id_3' },
              // sloth: { 'aria-describedby': 'some_id_4' },
            },
          },
        },
      },
      schema: {
        type: 'object',
        properties: {
          radioButtonGroupExample: {
            type: 'string',
            enum: ['dog', 'cat', 'octopus', 'sloth'],
          },
        },
      },
    },

    checkboxGroupPattern: {
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
    },
  },
};

export default availableFeaturesAndUsageChapter;

const intermediateTutorialChapter = {
  title: 'Chapter Title: Intermediate tutorial examples',
  pages: {
    expandUnder: {
      path: 'expand-under',
      title: 'Section Title: Expand under', // ignored?
      uiSchema: {
        expandUnderExample: {
          'ui:title': 'Page Title: Expand under example',
          'ui:description':
            'Description: Choose "Yes" to reveal a conditional field',
          'ui:widget': 'yesNo',
          'ui:options': {
            labels: {
              Y: 'Yes, this is what I want',
              N: 'No, I do not want this',
            },
            widgetProps: {
              Y: { 'data-info': 'yes' },
              N: { 'data-info': 'no' },
            },
            // Only added to the radio when it is selected
            // a11y requirement: aria-describedby ID's *must* exist on the page;
            // and we conditionally add content based on the selection
            selectedProps: {
              Y: {
                'aria-describedby': 'root_conditionalExpandUnderField-label',
              },
              // this ID doesn't exist, setting this would cause an axe error
              // N: { 'aria-describedby': 'different_id' },
            },
          },
        },
        conditionalExpandUnderField: {
          'ui:title': 'Page Title: Conditional expand under field',
          'ui:description': 'Description: Conditional expand under field',
          'ui:options': {
            expandUnder: 'expandUnderExample',
          },
        },
      },
      schema: {
        type: 'object',
        properties: {
          expandUnderExample: {
            type: 'boolean',
          },
          conditionalExpandUnderField: {
            type: 'string',
          },
        },
      },
    },

    conditionalFields: {
      path: 'conditionally-hidden',
      title: 'Section Title: Conditionally hidden',
      uiSchema: {
        conditionallyHiddenFieldExample: {
          'ui:title': 'Page Title: Conditionally hidden example',
          'ui:description':
            'Description: Choose "Yes" to reveal a conditionally hidden field, AND reveal the next condition page',
          'ui:widget': 'yesNo',
          'ui:options': {
            labels: {
              Y: 'Yes, this is what I want',
              N: 'No, I do not want this',
            },
            widgetProps: {
              Y: { 'data-info': 'yes' },
              N: { 'data-info': 'no' },
            },
            // Only added to the radio when it is selected
            // a11y requirement: aria-describedby ID's *must* exist on the page;
            // and we conditionally add content based on the selection
            selectedProps: {
              Y: { 'aria-describedby': 'root_conditionalhiddenField-label' },
              // this ID doesn't exist, setting this would cause an axe error
              // N: { 'aria-describedby': 'different_id' }
            },
          },
        },
        conditionalhiddenField: {
          'ui:title': 'Page Title: Conditionally hidden field',
          'ui:description': 'Description: Conditionally hidden field',
          'ui:options': {
            hideIf: formData =>
              formData.conditionallyHiddenFieldExample !== true,
          },
        },
      },
      schema: {
        type: 'object',
        properties: {
          conditionallyHiddenFieldExample: {
            type: 'boolean',
          },
          conditionalhiddenField: {
            type: 'string',
          },
        },
      },
    },

    conditionalPages: {
      title: 'Section Title: Conditional page',
      path: 'conditional-page',
      depends: form => form.conditionallyHiddenFieldExample,
      uiSchema: {
        conditionallyHiddenPageExample: {
          'ui:title': 'Page Title: Conditional page example',
          'ui:description':
            'Description: This page is shown when conditional field value on the previous page is selected',
          'ui:widget': 'yesNo',
          'ui:options': {
            labels: {
              Y: 'Yes, this is what I want',
              N: 'No, I do not want this',
            },
            widgetProps: {
              Y: { 'data-info': 'yes' },
              N: { 'data-info': 'no' },
            },
            // Only added to the radio when it is selected
            // a11y requirement: aria-describedby ID's *must* exist on the page;
            // and we conditionally add content based on the selection
            selectedProps: {
              Y: { 'aria-describedby': 'some_id' },
              N: { 'aria-describedby': 'different_id' },
            },
          },
        },
      },
      schema: {
        type: 'object',
        properties: {
          conditionallyHiddenPageExample: {
            type: 'boolean',
          },
        },
      },
    },
  },
};

export default intermediateTutorialChapter;

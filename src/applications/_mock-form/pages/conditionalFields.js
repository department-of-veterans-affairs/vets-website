const conditionalFields = {
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
        hideIf: formData => formData.conditionallyHiddenFieldExample !== true,
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
};

export default conditionalFields;

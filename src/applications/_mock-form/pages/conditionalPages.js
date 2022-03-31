const conditionalPages = {
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
};

export default conditionalPages;

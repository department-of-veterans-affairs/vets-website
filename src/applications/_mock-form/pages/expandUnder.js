const expandUnder = {
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
};

export default expandUnder;

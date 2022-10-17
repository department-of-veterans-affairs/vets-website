const radioButtonGroup = {
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
};

export default radioButtonGroup;

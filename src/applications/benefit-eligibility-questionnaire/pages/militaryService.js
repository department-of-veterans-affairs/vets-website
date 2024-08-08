export default {
  uiSchema: {
    militaryService: {
      'ui:title': 'Are you currently serving in the military?',
      'ui:widget': 'radio',
      'ui:options': {
        widgetProps: {
          YES: { militaryService: 'Yes' },
          NO: { militaryService: 'No' },
        },
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      militaryService: {
        type: 'string',
        enum: ['Yes', 'No'],
      },
    },
  },
};

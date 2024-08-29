export default {
  uiSchema: {
    contactInfoSettings: {
      'ui:title': 'Which contact info fields need to be required?',
      'ui:widget': 'radio',
      'ui:options': {
        labels: {
          home: 'Home address, email address & home phone',
        },
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      contactInfoSettings: {
        type: 'string',
        enum: ['home'],
      },
    },
  },
};

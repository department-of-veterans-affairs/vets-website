export default {
  uiSchema: {
    contactInfoSettings: {
      'ui:title': 'Which contact info fields need to be required?',
      'ui:widget': 'radio',
      'ui:options': {
        labels: {
          none: 'None, but show all fields',
          email: 'Email address',
          home: 'Home address, email address & home phone',
          mobile: 'Home address, email address & mobile phone',
          all: 'Home address, email address, home OR mobile phone',
        },
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      contactInfoSettings: {
        type: 'string',
        enum: ['none', 'email', 'mobile', 'home', 'all'],
      },
    },
  },
};

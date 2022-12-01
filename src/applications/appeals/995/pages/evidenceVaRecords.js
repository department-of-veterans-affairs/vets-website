export default {
  uiSchema: {},
  schema: {
    type: 'object',
    properties: {
      'view:vaMedicalRecordsIntro': {
        type: 'object',
        properties: {},
      },
      /*
      locations: {
        type: 'array',
        // minItems: 0, // fixes validation issue
        items: {
          type: 'object',
          required: ['locationAndName', 'evidenceDates'],
          properties: {
            locationAndName: {
              type: 'string',
              minLength: 1,
              maxLength: 255,
            },
            evidenceDates: {
              type: 'object',
              required: ['from', 'to'],
              properties: {
                from: {
                  type: 'string',
                  // pattern: '^[0-9]{4}(-[0-9]{2}){2}$',
                  // minLength: 10,
                  // maxLength: 10,
                },
                to: {
                  type: 'string',
                  // pattern: '^[0-9]{4}(-[0-9]{2}){2}$',
                  // minLength: 10,
                  // maxLength: 10,
                },
              },
            },
          },
        },
      },
      */
    },
  },
};

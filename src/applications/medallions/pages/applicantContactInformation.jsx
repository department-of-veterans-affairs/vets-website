/** @type {PageSchema} */
export default {
  uiSchema: {},
  schema: {
    type: 'object',
    properties: {
      personalData: {
        type: 'object',
        properties: {
          veteranContactInformation: {
            type: 'object',
            properties: {
              mobilePhone: {
                type: 'object',
                properties: {
                  countryCode: {
                    type: 'string',
                    pattern: '^[0-9]+$',
                    minLength: 1,
                    maxLength: 3,
                  },
                  areaCode: {
                    type: 'string',
                    pattern: '^[0-9]{1,4}$',
                    minLength: 1,
                    maxLength: 4,
                  },
                  phoneNumber: {
                    type: 'string',
                    pattern: '^[0-9]{1,14}$',
                    minLength: 1,
                    maxLength: 14,
                  },
                  phoneNumberExt: {
                    type: 'string',
                    pattern: '^[a-zA-Z0-9]{1,10}$',
                    minLength: 1,
                    maxLength: 10,
                  },
                },
                required: ['areaCode', 'phoneNumber'],
              },
              email: {
                type: 'string',
                format: 'email',
                minLength: 6,
                maxLength: 255,
              },
            },
          },
        },
      },
    },
  },
};

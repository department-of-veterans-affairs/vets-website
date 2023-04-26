import formSchema from '../config/form-0995-schema.json';

const { address, phone } = formSchema.definitions;

const contactInfo = {
  uiSchema: {},

  schema: {
    type: 'object',
    properties: {
      veteran: {
        type: 'object',
        properties: {
          address: {
            ...address,
            // the schema has countryCodeISO2 and zipCode5
            required: ['addressLine1', 'city', 'countryCodeIso2', 'zipCode'],
          },
          homePhone: phone,
          mobilePhone: phone,
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
};

export default contactInfo;

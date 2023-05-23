import formSchema from '../config/form-0995-schema.json';

const { address, phone } = formSchema.definitions;
const {
  addressLine1,
  addressLine2,
  addressLine3,
  city,
  stateCode,
  countryCodeISO2,
  zipCode5,
  internationalPostalCode,
} = address.properties;
const contactInfo = {
  uiSchema: {},

  schema: {
    type: 'object',
    properties: {
      veteran: {
        type: 'object',
        required: ['address', 'email'],
        properties: {
          address: {
            type: 'object',
            properties: {
              addressLine1,
              addressLine2,
              addressLine3,
              city,
              stateCode,
              countryCodeIso2: countryCodeISO2,
              zipCode: zipCode5,
              internationalPostalCode,
            },
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

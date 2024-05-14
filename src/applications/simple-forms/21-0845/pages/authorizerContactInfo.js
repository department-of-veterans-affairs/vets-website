import definitions from 'vets-json-schema/dist/definitions.json';

/** @type {PageSchema} */
export default {
  uiSchema: {
    authorizerPhone: {
      'ui:title': 'Phone number',
      'ui:errorMessages': {
        required: 'Please enter a phone number.',
        pattern:
          'Please enter a 10-digit phone number (with or without dashes).',
      },
    },
    authorizerEmail: {
      'ui:title': 'Email address',
      'ui:widget': 'email',
      'ui:errorMessages': {
        format:
          'Enter a valid email address using the format email@domain.com. Your email address can only have letters, numbers, the @ symbol and a period, with no spaces.',
      },
    },
  },
  schema: {
    type: 'object',
    required: ['authorizerPhone'],
    properties: {
      authorizerPhone: definitions.phone,
      authorizerEmail: definitions.email,
    },
  },
};

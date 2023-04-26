import definitions from 'vets-json-schema/dist/definitions.json';

export default {
  uiSchema: {
    witnessPhone: {
      'ui:title': 'Phone number',
    },
    witnessEmail: {
      'ui:title': 'Email address',
    },
  },
  schema: {
    type: 'object',
    required: ['witnessPhone'],
    properties: {
      witnessPhone: definitions.phone,
      witnessEmail: definitions.email,
    },
  },
};

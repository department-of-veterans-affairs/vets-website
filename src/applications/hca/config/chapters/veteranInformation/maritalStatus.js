import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import PrefillMessage from 'platform/forms/save-in-progress/PrefillMessage';

const { maritalStatus } = fullSchemaHca.definitions;

export default {
  uiSchema: {
    'ui:description': PrefillMessage,
    maritalStatus: {
      'ui:title': 'Marital status',
    },
  },
  schema: {
    type: 'object',
    required: ['maritalStatus'],
    properties: {
      maritalStatus,
    },
  },
};

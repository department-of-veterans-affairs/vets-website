import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import PrefillMessage from 'platform/forms/save-in-progress/PrefillMessage';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';

const { date } = fullSchemaHca.definitions;

export default {
  uiSchema: {
    'ui:description': PrefillMessage,
    veteranDateOfBirth: currentOrPastDateUI('Date of birth'),
  },
  schema: {
    type: 'object',
    required: ['veteranDateOfBirth'],
    properties: {
      veteranDateOfBirth: date,
    },
  },
};

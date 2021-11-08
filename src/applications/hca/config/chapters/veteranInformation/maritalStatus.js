// TODO: Do we need to add maritalStatuses to fullSchema?
// import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import { maritalStatuses } from 'platform/static-data/options-for-select';
import PrefillMessage from 'platform/forms/save-in-progress/PrefillMessage';

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
      maritalStatus: {
        type: 'string',
        enum: maritalStatuses,
      },
    },
  },
};

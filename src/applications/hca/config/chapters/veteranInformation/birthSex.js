import { genderLabels } from 'platform/static-data/labels';
import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';

import PrefillMessage from 'platform/forms/save-in-progress/PrefillMessage';

const { gender } = fullSchemaHca.properties;

export default {
  uiSchema: {
    'ui:description': PrefillMessage,
    gender: {
      'ui:title': 'Birth sex',
      'ui:widget': 'radio',
      'ui:options': {
        labels: genderLabels,
      },
    },
  },
  schema: {
    type: 'object',
    required: ['gender'],
    properties: {
      gender,
    },
  },
};

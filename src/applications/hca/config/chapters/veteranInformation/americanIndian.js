// import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';

import PrefillMessage from 'platform/forms/save-in-progress/PrefillMessage';

// const { isAmericanIndian } = fullSchemaHca.properties;

export default {
  uiSchema: {
    'ui:description': PrefillMessage,
    isAmericanIndian: {
      'ui:title':
        'Are you recognized as an American Indian or Alaska Native by any tribal, state, or federal law or regulation?',
      'ui:widget': 'yesNo',
    },
  },
  schema: {
    type: 'object',
    required: [],
    properties: {
      isAmericanIndian: {
        type: 'boolean',
      },
    },
  },
};

import {
  textUI,
  textSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    ...titleUI('Cemetery location'),
    cemeteryLocation: {
      'ui:description':
        'You selected that the deceased Veteran was buried in a state cemetery. Enter additional information here.',
      name: textUI('Name of state cemetery'),
      zip: textUI('Zip code for state cemetery'),
    },
  },
  schema: {
    type: 'object',
    properties: {
      cemeteryLocation: {
        type: 'object',
        required: ['name', 'zip'],
        properties: {
          name: textSchema,
          zip: textSchema,
        },
      },
    },
  },
};

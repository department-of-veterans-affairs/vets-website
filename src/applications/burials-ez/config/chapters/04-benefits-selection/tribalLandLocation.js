import {
  textUI,
  textSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { generateTitle } from '../../../utils/helpers';

export default {
  uiSchema: {
    'ui:title': generateTitle('Cemetery location'),
    tribalLandLocation: {
      'ui:description':
        'You selected that the deceased Veteran was buried on tribal trust land. Enter additional information here.',
      name: textUI('Name of tribal trust land'),
      zip: textUI('Zip code for tribal trust land'),
    },
  },
  schema: {
    type: 'object',
    properties: {
      tribalLandLocation: {
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

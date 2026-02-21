import fullSchemaBurials from 'vets-json-schema/dist/21P-530EZ-schema.json';
import get from '@department-of-veterans-affairs/platform-forms-system/get';
import {
  radioUI,
  textUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { locationOfDeathLabels } from '../../../utils/labels';

const { locationOfDeath } = fullSchemaBurials.properties;

export default {
  uiSchema: {
    ...titleUI('Veteran death location'),
    locationOfDeath: {
      location: radioUI({
        title: `Where did the Veteran’s death occur?`,
        labels: locationOfDeathLabels,
        errorMessages: {
          required: `Select where the Veteran’s death happened`,
        },
        labelHeaderLevel: '',
      }),
      other: {
        ...textUI({
          title: 'Place where the Veteran’s death happened',
          errorMessages: {
            required: 'Enter where the Veteran’s death happened',
          },
          required: form => get('locationOfDeath.location', form) === 'other',
        }),
        'ui:options': {
          hideIf: form => get('locationOfDeath.location', form) !== 'other',
          classNames: 'vads-u-margin-top--2',
        },
      },
    },
  },
  schema: {
    type: 'object',
    required: ['locationOfDeath'],
    properties: {
      locationOfDeath: {
        ...locationOfDeath,
        properties: {
          location: locationOfDeath.properties.location,
          other: locationOfDeath.properties.other,
        },
      },
    },
  },
};

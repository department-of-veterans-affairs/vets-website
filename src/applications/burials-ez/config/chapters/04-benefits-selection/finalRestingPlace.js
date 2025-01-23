import get from '@department-of-veterans-affairs/platform-forms-system/get';
import {
  radioUI,
  radioSchema,
  textUI,
  textSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { restingPlaceLabels } from '../../../utils/labels';
import { generateTitle } from '../../../utils/helpers';

export default {
  uiSchema: {
    'ui:title': generateTitle('Final resting place'),
    finalRestingPlace: {
      location: radioUI({
        title:
          'Choose the option that best describes the Veteran’s final resting place',
        labels: restingPlaceLabels,
      }),
      other: textUI({
        title: 'Final resting place of the deceased Veteran’s remains',
        required: form => get('finalRestingPlace.location', form) === 'other',
        hideIf: form => get('finalRestingPlace.location', form) !== 'other',
      }),
    },
  },
  schema: {
    type: 'object',
    properties: {
      finalRestingPlace: {
        type: 'object',
        required: ['location'],
        properties: {
          location: radioSchema(Object.keys(restingPlaceLabels)),
          other: textSchema,
        },
      },
    },
  },
};

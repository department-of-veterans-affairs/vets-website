import get from '@department-of-veterans-affairs/platform-forms-system/get';
import {
  radioUI,
  radioSchema,
  textUI,
  textSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { restingPlaceLabels } from '../../../utils/labels';

export default {
  uiSchema: {
    ...titleUI('Final resting place'),
    finalRestingPlace: {
      location: radioUI({
        title:
          'Which of these best describes the Veteran’s final resting place?',
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

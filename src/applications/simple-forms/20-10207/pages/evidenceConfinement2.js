import {
  currentOrPastDateSchema,
  currentOrPastDateUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { powConfinement2DateRangeValidation } from '../helpers';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Former prisoner of war'),
    powConfinement2StartDate: currentOrPastDateUI({
      title: 'Start of confinement',
      hint:
        'Tell us the dates you confinement began as a prisoner of war a second time.',
      required: () => true,
      errorMessages: {
        required: 'Provide the start date of confinement',
      },
    }),
    powConfinement2EndDate: currentOrPastDateUI({
      title: 'End of confinement',
      hint:
        'Tell us the dates your confinement ended as a prisoner of war a second time.',
      required: () => true,
      errorMessages: {
        required: 'Provide the end date of confinement',
      },
    }),
    'ui:validations': [powConfinement2DateRangeValidation],
  },
  schema: {
    type: 'object',
    properties: {
      powConfinement2StartDate: currentOrPastDateSchema,
      powConfinement2EndDate: currentOrPastDateSchema,
    },
    required: ['powConfinement2StartDate', 'powConfinement2EndDate'],
  },
};

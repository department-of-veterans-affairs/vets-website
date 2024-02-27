import {
  currentOrPastDateSchema,
  currentOrPastDateUI,
  titleUI,
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { POW_MULTIPLE_CONFINEMENTS_LABELS } from '../config/constants';
import { powConfinementDateRangeValidation } from '../helpers';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Former prisoner of war'),
    powConfinementStartDate: currentOrPastDateUI({
      title: 'Start of confinement',
      hint: 'Tell us the dates your confinement began as a prisoner of war.',
      required: () => true,
      errorMessages: {
        required: 'Provide the start date of confinement',
      },
    }),
    powConfinementEndDate: currentOrPastDateUI({
      title: 'End of confinement',
      hint: 'Tell us the dates your confinement ended as a prisoner of war.',
      required: () => true,
      errorMessages: {
        required: 'Provide the end date of confinement',
      },
    }),
    powMultipleConfinements: yesNoUI({
      title: 'Were you confined more than once?',
      labels: POW_MULTIPLE_CONFINEMENTS_LABELS,
      errorMessages: {
        required: 'Select whether you were confined more than once',
      },
    }),
    'ui:validations': [powConfinementDateRangeValidation],
  },
  schema: {
    type: 'object',
    properties: {
      powConfinementStartDate: currentOrPastDateSchema,
      powConfinementEndDate: currentOrPastDateSchema,
      powMultipleConfinements: yesNoSchema,
    },
    required: [
      'powConfinementStartDate',
      'powConfinementEndDate',
      'powMultipleConfinements',
    ],
  },
};

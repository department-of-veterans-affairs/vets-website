import {
  checkboxGroupSchema,
  checkboxGroupUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { RECORD_TYPES, RECORD_TYPE_LABELS } from '../config/constants';

/** @type {PageSchema} */
export default {
  uiSchema: {
    recordSelections: checkboxGroupUI({
      title:
        'Select at least one compensation, and pension, or other benefit record',
      hint:
        'Depending on your selection, we may ask for more details on the upcoming pages.',
      labelHeaderLevel: '3',
      required: true,
      labels: RECORD_TYPE_LABELS,
      errorMessages: {
        required: 'Select at least one record',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      recordSelections: checkboxGroupSchema(Object.values(RECORD_TYPES)),
    },
    required: ['recordSelections'],
  },
};

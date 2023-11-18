import {
  checkboxGroupSchema,
  checkboxGroupUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { RECORD_TYPES, RECORD_TYPE_LABELS } from '../config/constants';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      'Select at least one record',
      'Depending on your selection, we may ask for more details on the upcoming pages.',
    ),
    recordSelections: checkboxGroupUI({
      title: 'Compensation and pension, or other benefit',
      labelHeaderLevel: '4',
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

import {
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

import { PREPARER_TYPES, PREPARER_TYPE_LABELS } from '../config/constants';

/** @type {PageSchema} */
export default {
  uiSchema: {
    preparerType: radioUI({
      title: 'Which of these best describes you?',
      labels: PREPARER_TYPE_LABELS,
      errorMessages: {
        required: 'Please select your identity',
      },
      labelHeaderLevel: '3',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      preparerType: radioSchema(Object.values(PREPARER_TYPES)),
    },
    required: ['preparerType'],
  },
};

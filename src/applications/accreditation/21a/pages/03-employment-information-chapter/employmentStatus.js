import {
  radioSchema,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { employmentStatusOptions } from '../../constants/options';

/** @type {PageSchema} */
export default {
  title: 'Employment status',
  path: 'employment-status',
  uiSchema: {
    employmentStatus: radioUI({
      title: 'Select the status of your employment.',
      labels: employmentStatusOptions,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      employmentStatus: radioSchema(Object.keys(employmentStatusOptions)),
    },
    required: ['employmentStatus'],
  },
};

import {
  checkboxGroupSchema,
  checkboxGroupUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { employmentStatusOptions } from '../../constants/options';

/** @type {PageSchema} */
export default {
  title: 'Employment status',
  path: 'employment-status',
  uiSchema: {
    employmentStatus: checkboxGroupUI({
      title: 'Select the status of your employment.',
      required: true,
      labels: employmentStatusOptions,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      employmentStatus: checkboxGroupSchema(
        Object.keys(employmentStatusOptions),
      ),
    },
    required: ['employmentStatus'],
  },
};

// @ts-check
import {
  titleUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Workers’ compensation benefits'),
    receivesWorkersCompensation: yesNoUI({
      title:
        'Do you receive or expect to receive workers’ compensation benefits?',
      errorMessages: {
        required:
          'Select if you receive or expect to receive workers’ compensation benefits',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      receivesWorkersCompensation: yesNoSchema,
    },
    required: ['receivesWorkersCompensation'],
  },
};

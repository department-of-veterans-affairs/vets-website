// @ts-check
import {
  yesNoSchema,
  yesNoUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Medical School Information'),
    programAtLeast32Months: yesNoUI({
      title:
        'Your institution provides, and requires students to complete, a program of clinical and classroom instruction that is at least 32 months in length.',
      errorMessages: {
        required: 'Select one of the options below.',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      programAtLeast32Months: yesNoSchema,
    },
    required: ['programAtLeast32Months'],
  },
};

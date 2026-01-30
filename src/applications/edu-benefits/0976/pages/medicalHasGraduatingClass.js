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
    graduatedLast12Months: yesNoUI({
      title:
        'Your institution graduated classes during each of the last two 12-month periods.',
      errorMessages: {
        required:
          'Select ‘yes’ if your institution graduated classes during each of the last two 12-month periods.',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      graduatedLast12Months: yesNoSchema,
    },
    required: ['graduatedLast12Months'],
  },
};

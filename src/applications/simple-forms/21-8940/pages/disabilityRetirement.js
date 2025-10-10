// @ts-check
import {
  titleUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Disability retirement benefits'),
    receivesDisabilityRetirement: yesNoUI({
      title:
        'Do you receive or expect to receive disability retirement benefits?',
      errorMessages: {
        required:
          'Select if you receive or expect to receive disability retirement benefits',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      receivesDisabilityRetirement: yesNoSchema,
    },
    required: ['receivesDisabilityRetirement'],
  },
};

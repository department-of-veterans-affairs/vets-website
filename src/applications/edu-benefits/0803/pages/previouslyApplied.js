// @ts-check
import {
  yesNoSchema,
  yesNoUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Your VA education benefits'),
    hasPreviouslyApplied: {
      ...yesNoUI({
        title: 'Have you previously applied for VA education benefits?',
        required: () => true,
      }),
    },
  },
  schema: {
    type: 'object',
    properties: {
      hasPreviouslyApplied: yesNoSchema,
    },
    required: ['hasPreviouslyApplied'],
  },
};

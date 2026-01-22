// @ts-check
import {
  textUI,
  textSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('What is your institution’s web address?'),
    website: {
      ...textUI({
        title: 'Your institution’s website address',
        errorMessages: {
          required: 'Enter your institutions web address',
        },
      }),
    },
  },
  schema: {
    type: 'object',
    properties: {
      website: textSchema,
    },
    required: ['website'],
  },
};

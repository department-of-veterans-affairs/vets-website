// @ts-check
import {
  textUI,
  textSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { validateWhiteSpace } from 'platform/forms/validations';

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
        validations: [validateWhiteSpace],
      }),
    },
  },
  schema: {
    type: 'object',
    properties: {
      website: {
        ...textSchema,
        maxLength: 300,
      },
    },
    required: ['website'],
  },
};

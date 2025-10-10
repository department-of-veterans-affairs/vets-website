// @ts-check
import {
  textareaUI,
  textareaSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    explanationForLeaving: textareaUI({
      title: 'Explanation for leaving',
      labelHeaderLevel: '1',
      charcount: true,
      errorMessages: {
        required: 'Enter an explanation for leaving your job',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      explanationForLeaving: {
        ...textareaSchema,
        maxLength: 200,
      },
    },
    required: ['explanationForLeaving'],
  },
};

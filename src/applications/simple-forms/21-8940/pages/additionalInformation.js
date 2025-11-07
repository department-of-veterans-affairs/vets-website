// @ts-check
import {
  titleUI,
  textareaUI,
  textareaSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Additional information'),
    additionalInformation: textareaUI({
      title: 'Do you have any additional information to include?',
      hint:
        'You can include any additional information that may help us make a decision.',
      charcount: true,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      additionalInformation: {
        ...textareaSchema,
        maxLength: 400,
      },
    },
  },
};

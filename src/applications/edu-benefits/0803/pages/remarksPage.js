// @ts-check
import {
  textareaUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Enter any remarks you would like to share'),
    remarks: {
      ...textareaUI({
        title: 'Use this space to add any information you’d like to include',
        charcount: true,
      }),
    },
  },
  schema: {
    type: 'object',
    properties: {
      remarks: {
        type: 'string',
        maxLength: 500,
      },
    },
  },
};

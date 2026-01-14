// @ts-check
import {
  textareaUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    ...titleUI('TBD: Other title'),
    otherText: {
      ...textareaUI({
        title: 'TBD Other subtitle',
        charcount: true,
      }),
    },
  },
  schema: {
    type: 'object',
    properties: {
      otherText: {
        type: 'string',
        maxLength: 500,
      },
    },
    required: ['otherText'],
  },
};

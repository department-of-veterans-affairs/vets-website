// @ts-check
import {
  textareaUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    ...titleUI('Application information'),
    otherText: {
      ...textareaUI({
        title:
          'Since you selected “other” on the previous page, you’ll need to provide more details about the purpose of your application',
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

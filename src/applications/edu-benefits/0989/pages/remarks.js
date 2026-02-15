// @ts-check
import {
  textareaUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    ...titleUI('Enter any remarks you would like to share'),
    remarks: {
      ...textareaUI({
        title:
          'Additional information to support your request of entitlement restoration',
        charcount: true,
        errorMessages: {
          maxLength:
            'You are over the character limit. You must adjust your remarks.',
        },
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

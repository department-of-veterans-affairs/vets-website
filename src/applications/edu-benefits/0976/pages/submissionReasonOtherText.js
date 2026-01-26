// @ts-check
import {
  textareaUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { validateWhiteSpace } from 'platform/forms/validations';

export default {
  uiSchema: {
    ...titleUI('Application information'),
    otherText: {
      ...textareaUI({
        title:
          'Since you selected “other” on the previous page, you’ll need to provide more details about the purpose of your application',
        charcount: true,
        validations: [validateWhiteSpace],
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

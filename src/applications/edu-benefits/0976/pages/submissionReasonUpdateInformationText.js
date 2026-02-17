// @ts-check
import {
  textareaUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { validateWhiteSpace } from 'platform/forms/validations';

export default {
  uiSchema: {
    ...titleUI('Application information'),
    updateInformationText: {
      ...textareaUI({
        title:
          'Since you selected “update information” on the previous page, you’ll need to list at least one reason for your application',
        hint: 'This may include issues such as change of address, banking information, etc.',
        charcount: true,
        validations: [validateWhiteSpace],
      }),
    },
  },
  schema: {
    type: 'object',
    properties: {
      updateInformationText: {
        type: 'string',
        maxLength: 500,
      },
    },
    required: ['updateInformationText'],
  },
};

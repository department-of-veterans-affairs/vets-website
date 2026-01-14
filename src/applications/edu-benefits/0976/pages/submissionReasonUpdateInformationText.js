// @ts-check
import {
  textareaUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    ...titleUI('TBD: Update information title'),
    updateInformationText: {
      ...textareaUI({
        title: 'TBD Update information subtitle',
        charcount: true,
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

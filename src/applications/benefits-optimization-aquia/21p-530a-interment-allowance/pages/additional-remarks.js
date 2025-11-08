import {
  textareaUI,
  textareaSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export const additionalRemarksPage = {
  uiSchema: {
    additionalRemarks: textareaUI({
      title: 'Provide any additional remarks about your application',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      additionalRemarks: textareaSchema,
    },
  },
};

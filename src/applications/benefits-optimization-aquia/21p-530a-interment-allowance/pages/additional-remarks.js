import {
  textareaUI,
  textareaSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

export const additionalRemarksPage = {
  uiSchema: {
    ...titleUI('Additional remarks'),
    remarks: textareaUI({
      title: 'Provide any additional remarks about your application',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      remarks: textareaSchema,
    },
  },
};

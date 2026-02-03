import {
  titleUI,
  textareaUI,
  textareaSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export const uiSchema = {
  ...titleUI({
    title: 'Enter your remarks',
  }),
  remarks: textareaUI({
    title:
      "Use this space to enter any information you'd like to include in your request",
    errorMessages: {
      maxLength:
        'You are over the character limit. Please adjust your remarks.',
    },
    charcount: true,
  }),
};

export const schema = {
  type: 'object',
  properties: {
    remarks: {
      ...textareaSchema,
      maxLength: 500,
    },
  },
};

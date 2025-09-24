import {
  titleUI,
  textareaUI,
  textareaSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export const uiSchema = {
  ...titleUI({
    title: 'Please enter any remarks you would like to share',
  }),
  remarks: textareaUI({
    title: ' ',
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

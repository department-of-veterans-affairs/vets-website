import {
  titleUI,
  textareaUI,
  textareaSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    ...titleUI('Additional information'),
    remarks: textareaUI(
      'Enter any other information you’d like to include with your application.',
    ),
  },
  schema: {
    type: 'object',
    properties: {
      remarks: textareaSchema,
    },
  },
};

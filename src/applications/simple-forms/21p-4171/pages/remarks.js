import {
  textareaUI,
  textareaSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Remarks'),
    remarks: textareaUI({
      title: 'Remarks (if any)',
      required: false,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      remarks: {
        ...textareaSchema,
        maxLength: 2000,
      },
    },
    required: [],
  },
};

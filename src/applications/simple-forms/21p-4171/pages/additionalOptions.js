import {
  checkboxUI,
  checkboxSchema,
  textareaUI,
  textareaSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Additional information'),
    option2: checkboxUI('Option 2'),
    option3: checkboxUI('Option 3'),
    remarks: textareaUI('Remarks'),
  },
  schema: {
    type: 'object',
    properties: {
      option2: checkboxSchema,
      option3: checkboxSchema,
      remarks: textareaSchema,
    },
    required: [],
  },
};

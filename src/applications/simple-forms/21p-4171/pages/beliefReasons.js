import {
  textareaUI,
  textareaSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Facts and reasons for belief'),
    beliefReasons: textareaUI({
      title: 'Please provide the facts and reasons for your belief',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      beliefReasons: textareaSchema,
    },
    required: [],
  },
};

import {
  titleUI,
  numberUI,
  numberSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('RJSF'),
    amountOrNumber: numberUI({
      title: 'Amount',
      hint: 'Hint text',
      width: 'xs',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      amountOrNumber: numberSchema,
    },
    required: ['amountOrNumber'],
  },
};

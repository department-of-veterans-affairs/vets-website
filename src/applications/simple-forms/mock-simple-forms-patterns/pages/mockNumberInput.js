import {
  titleUI,
  numberUI,
  numberSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Web component number input'),
    amountOrNumber: numberUI({
      title: 'Amount',
      hint: 'Hint text',
      width: 'xs',
    }),
    withMinMax: numberUI({
      title: 'With min and max',
      hint: 'Please enter a valid number between 1 and 99',
      min: 1,
      max: 99,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      amountOrNumber: numberSchema,
      withMinMax: numberSchema,
    },
    required: ['amountOrNumber'],
  },
};

import {
  numberUI,
  numberSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Presidential Memorial Certificate'),
    quantityText: numberUI({
      title: 'How many Presidential Memorial Certificates do you want?',
      hint: 'You can’t request more than 99',
      min: 1,
      max: 99,
    }),
  },

  schema: {
    type: 'object',
    properties: {
      quantityText: numberSchema,
    },
    required: ['quantityText'],
  },
};

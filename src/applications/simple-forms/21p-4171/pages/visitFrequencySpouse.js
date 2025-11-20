import {
  textareaUI,
  textareaSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Your visits to the spouse'),
    visitFrequencySpouse: textareaUI({
      title: 'How often had/have you visited the claimed spouse?',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      visitFrequencySpouse: {
        ...textareaSchema,
        maxLength: 500,
      },
    },
    required: ['visitFrequencySpouse'],
  },
};

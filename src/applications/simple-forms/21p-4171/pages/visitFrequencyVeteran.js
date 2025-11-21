import {
  textareaUI,
  textareaSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Your visits to the Veteran'),
    visitFrequencyVeteran: textareaUI({
      title: 'How often had/have you visited the Veteran?',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      visitFrequencyVeteran: {
        ...textareaSchema,
        maxLength: 500,
      },
    },
    required: ['visitFrequencyVeteran'],
  },
};

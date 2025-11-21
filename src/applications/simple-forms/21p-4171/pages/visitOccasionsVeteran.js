import {
  textareaUI,
  textareaSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Occasions you visited the Veteran'),
    visitOccasionsVeteran: textareaUI({
      title: 'On what occasion(s) had/have you visited the Veteran?',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      visitOccasionsVeteran: {
        ...textareaSchema,
        maxLength: 500,
      },
    },
    required: ['visitOccasionsVeteran'],
  },
};

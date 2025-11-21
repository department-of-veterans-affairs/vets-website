import {
  textareaUI,
  textareaSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Visitation information'),
    witness: {
      visitFrequencyVeteran: textareaUI({
        title: 'How often had/have you visited the Veteran?',
      }),
      visitOccasionsVeteran: textareaUI({
        title: 'On what occasion(s) had/have you visited the Veteran?',
      }),
      visitFrequencySpouse: textareaUI({
        title: 'How often had/have you visited the claimed spouse?',
      }),
      visitOccasionsSpouse: textareaUI({
        title: 'On what occasions have you met the claimed spouse?',
      }),
    },
  },
  schema: {
    type: 'object',
    properties: {
      witness: {
        type: 'object',
        properties: {
          visitFrequencyVeteran: {
            ...textareaSchema,
            maxLength: 500,
          },
          visitOccasionsVeteran: {
            ...textareaSchema,
            maxLength: 500,
          },
          visitFrequencySpouse: {
            ...textareaSchema,
            maxLength: 500,
          },
          visitOccasionsSpouse: {
            ...textareaSchema,
            maxLength: 500,
          },
        },
        required: [
          'visitFrequencyVeteran',
          'visitOccasionsVeteran',
          'visitFrequencySpouse',
          'visitOccasionsSpouse',
        ],
      },
    },
    required: ['witness'],
  },
};

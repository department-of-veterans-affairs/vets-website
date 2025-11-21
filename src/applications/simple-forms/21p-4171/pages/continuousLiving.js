import {
  yesNoUI,
  yesNoSchema,
  textareaUI,
  textareaSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Continuous cohabitation'),
    living: {
      continuous: yesNoUI(
        'Had/have the Veteran and the claimed spouse lived together continuously?',
      ),
      explanation: {
        ...textareaUI('Explanation'),
        'ui:options': {
          expandUnder: 'continuous',
          expandUnderCondition: false,
        },
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      living: {
        type: 'object',
        properties: {
          continuous: yesNoSchema,
          explanation: {
            ...textareaSchema,
            maxLength: 1000,
          },
        },
        required: ['continuous'],
      },
    },
    required: ['living'],
  },
};

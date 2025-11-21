import {
  titleUI,
  yesNoUI,
  yesNoSchema,
  textareaUI,
  textareaSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Additional information'),
    hasAdditionalInfo: yesNoUI(
      'Do you have any additional information to provide?',
    ),
    explanation: {
      ...textareaUI('Please provide additional information'),
      'ui:options': {
        expandUnder: 'hasAdditionalInfo',
        expandUnderCondition: true,
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      hasAdditionalInfo: yesNoSchema,
      explanation: textareaSchema,
    },
    required: ['hasAdditionalInfo'],
  },
};

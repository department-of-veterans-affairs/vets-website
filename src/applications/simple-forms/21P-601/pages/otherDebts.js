import {
  titleUI,
  yesNoUI,
  yesNoSchema,
  textareaUI,
  textareaSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    ...titleUI('Other debts of the deceased'),
    hasOtherDebts: yesNoUI('Did the deceased have other outstanding debts?'),
    otherDebtsDescription: {
      ...textareaUI('Please describe the other debts'),
      'ui:options': {
        expandUnder: 'hasOtherDebts',
        expandUnderCondition: true,
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      hasOtherDebts: yesNoSchema,
      otherDebtsDescription: textareaSchema,
    },
  },
};

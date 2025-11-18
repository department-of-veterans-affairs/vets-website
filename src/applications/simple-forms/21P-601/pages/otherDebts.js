import {
  titleUI,
  yesNoUI,
  yesNoSchema,
  textareaUI,
  textareaSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    ...titleUI('Beneficiary’s other debts'),
    hasOtherDebts: yesNoUI(
      'Did the beneficiary have any other outstanding debts?',
    ),
    otherDebtsDescription: {
      ...textareaUI('Please describe the other debts.'),
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

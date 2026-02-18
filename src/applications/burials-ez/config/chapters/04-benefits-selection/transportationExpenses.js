import {
  titleUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    ...titleUI('Transportation reimbursement'),
    transportationExpenses: yesNoUI(
      'Are you responsible for the transportation of the Veteran’s remains to the final resting place?',
    ),
  },
  schema: {
    type: 'object',
    required: ['transportationExpenses'],
    properties: {
      transportationExpenses: yesNoSchema,
    },
  },
};

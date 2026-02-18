import {
  titleUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    ...titleUI('Plot or interment allowance'),
    plotExpenseResponsibility: yesNoUI(
      'Are you responsible for the Veteran’s plot or interment expenses?',
    ),
  },
  schema: {
    type: 'object',
    required: ['plotExpenseResponsibility'],
    properties: {
      plotExpenseResponsibility: yesNoSchema,
    },
  },
};

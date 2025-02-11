import {
  titleUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export const additionalInformationPartTwo = {
  uiSchema: {
    ...titleUI('Additional information about this child'),
    incomeInLastYear: yesNoUI({
      title:
        'Did this child have income in the last 365 days? Answer this question only if you are adding this dependent to your pension.',
      labels: {
        Y: 'Yes',
        N: 'No',
      },
      errorMessages: {
        required: 'Please select an option.',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      incomeInLastYear: yesNoSchema,
    },
  },
};

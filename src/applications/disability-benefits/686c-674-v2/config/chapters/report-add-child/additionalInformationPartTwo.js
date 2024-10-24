import {
  titleUI,
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export const additionalInformationPartTwo = {
  uiSchema: {
    ...titleUI('Additional information about this child'),
    incomeInLastYear: radioUI({
      title:
        'Did this child have income in the last 365 days? Answer this question only if you are adding this dependent to your pension.',
      required: () => true,
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
      incomeInLastYear: radioSchema(['Y', 'N']),
    },
    required: ['incomeInLastYear'],
  },
};

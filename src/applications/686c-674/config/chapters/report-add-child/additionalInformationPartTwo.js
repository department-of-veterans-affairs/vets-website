import {
  titleUI,
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export const additionalInformationPartTwo = {
  uiSchema: {
    ...titleUI('Additional information about this child'),
    incomeInLastYear: radioUI({
      title: 'Did this child have an income in the last 365 days?',
      hint:
        'Answer this question only if you are adding this dependent to your pension.',
      labels: {
        Y: 'Yes',
        N: 'No',
        NA: 'This question doesn’t apply to me',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      incomeInLastYear: radioSchema(['Y', 'N', 'NA']),
    },
  },
};

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
      labels: {
        Y: 'Yes',
        N: 'No',
      },
      required: () => true,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      incomeInLastYear: radioSchema(['Y', 'N']),
    },
  },
};

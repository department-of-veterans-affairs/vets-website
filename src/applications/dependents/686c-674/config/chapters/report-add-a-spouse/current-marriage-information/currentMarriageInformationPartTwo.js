import {
  titleUI,
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export const schema = {
  type: 'object',
  properties: {
    doesLiveWithSpouse: {
      type: 'object',
      properties: {
        spouseIncome: radioSchema(['Y', 'N']),
      },
    },
  },
};

export const uiSchema = {
  ...titleUI('Spouse’s income'),
  doesLiveWithSpouse: {
    spouseIncome: radioUI({
      title: 'Did your spouse have an income in the last 365 days?',
      hint:
        'Answer this question only if you are adding this dependent to your pension.',
      labels: {
        Y: 'Yes',
        N: 'No',
      },
      required: () => true,
    }),
  },
};

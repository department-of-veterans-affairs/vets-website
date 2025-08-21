import {
  titleUI,
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export const schema = {
  type: 'object',
  properties: {
    reportDivorce: {
      type: 'object',
      properties: {
        spouseIncome: radioSchema(['Y', 'N']),
      },
    },
  },
};

export const uiSchema = {
  reportDivorce: {
    ...titleUI('Divorced spouse’s income'),
    spouseIncome: radioUI({
      title: 'Did this dependent have an income in the last 365 days?',
      labels: {
        Y: 'Yes',
        N: 'No',
      },
      required: () => true,
    }),
  },
};

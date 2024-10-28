import {
  titleUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export const schema = {
  type: 'object',
  properties: {
    reportDivorce: {
      type: 'object',
      properties: {
        formerSpouseIncome: yesNoSchema,
      },
    },
  },
};

export const uiSchema = {
  reportDivorce: {
    ...titleUI('Divorced spouse’s income'),
    formerSpouseIncome: yesNoUI(
      'Did this dependent earn an income in the last 365 days? Answer this question only if you are adding this dependent to your pension.',
    ),
  },
};

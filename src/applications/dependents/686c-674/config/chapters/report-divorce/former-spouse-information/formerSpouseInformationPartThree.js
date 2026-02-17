import {
  titleUI,
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { incomeQuestionUpdateUiSchema } from '../../../helpers';

export const schema = {
  type: 'object',
  properties: {
    reportDivorce: {
      type: 'object',
      properties: {
        spouseIncome: radioSchema(['Y', 'N', 'NA']),
      },
    },
  },
};

export const uiSchema = {
  reportDivorce: {
    ...titleUI('Divorced spouse’s income'),
    spouseIncome: radioUI({
      title: 'Did this dependent have an income in the last 365 days?',
      hint:
        'Answer this question only if you are removing this dependent from your pension.',
      labels: {
        Y: 'Yes',
        N: 'No',
        NA: 'This question doesn’t apply to me',
      },
      required: (_chapterData, _index, formData) =>
        formData?.vaDependentsNetWorthAndPension,
      updateUiSchema: incomeQuestionUpdateUiSchema,
      updateSchema: (formData = {}, formSchema) => {
        const { vaDependentsNetWorthAndPension } = formData;

        if (!vaDependentsNetWorthAndPension) {
          return formSchema;
        }

        return {
          ...radioSchema(['Y', 'N']),
        };
      },
    }),
  },
};

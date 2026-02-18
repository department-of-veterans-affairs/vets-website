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
        spouseIncome: radioSchema(['Y', 'N', 'NA']),
      },
    },
  },
};

export const uiSchema = {
  ...titleUI('Spouse’s income'),
  doesLiveWithSpouse: {
    spouseIncome: radioUI({
      title: 'Has your spouse received income in the last 365 days?',
      hint:
        'Answer this question only if you are adding this dependent to your pension.',
      labels: {
        Y: 'Yes',
        N: 'No',
        NA: 'This question doesn’t apply to me',
      },
      required: (_chapterData, _index, formData) =>
        formData?.vaDependentsNetWorthAndPension,
      updateUiSchema: () => ({
        'ui:options': {
          hint: '',
        },
      }),
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

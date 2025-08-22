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
      labels: {
        Y: 'Yes',
        N: 'No',
        NA: 'This question does not apply to me',
      },
      'ui:options': {
        updateSchema: (formData = {}, formSchema) => {
          const { vaDependentsNetWorthAndPension } = formData;
          if (!vaDependentsNetWorthAndPension) {
            return formSchema;
          }
          return {
            ...formSchema,
            properties: {
              ...formSchema.properties,
              reportDivorce: {
                ...formSchema.properties.reportDivorce,
                required: ['spouseIncome'],
                properties: {
                  ...formSchema.properties.reportDivorce.properties,
                  spouseIncome: radioSchema(['Y', 'N']),
                },
              },
            },
          };
        },
      },
    }),
  },
};

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
            required: ['incomeInLastYear'],
            properties: {
              ...formSchema.properties,
              incomeInLastYear: radioSchema(['Y', 'N']),
            },
          };
        },
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

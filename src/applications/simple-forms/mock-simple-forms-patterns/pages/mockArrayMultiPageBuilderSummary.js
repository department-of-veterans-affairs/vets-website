import {
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export const arrayMultiPageBuilderSummary = {
  uiSchema: {
    'view:hasEmployment': yesNoUI({
      errorMessages: {
        required: 'Select yes if you have another employer to add',
      },
      updateUiSchema: formData => {
        return formData?.employers?.length
          ? {
              'ui:title': `Do you have another employer to report?`,
              'ui:options': {
                labelHeaderLevel: '4',
                hint: '',
                labels: {
                  Y: 'Yes, I have another employer to report',
                  N: 'No, I don’t have another employer to report',
                },
              },
            }
          : {
              'ui:title': `Do you have any employment, including self-employment for the last 5 years to report?`,
              'ui:options': {
                labelHeaderLevel: '3',
                hint:
                  'Include self-employment and military duty (including inactive duty for training).',
                labels: {
                  Y: 'Yes, I have employment to report',
                  N: 'No, I don’t have employment to report',
                },
              },
            };
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      'view:hasEmployment': yesNoSchema,
    },
    required: ['view:hasEmployment'],
  },
};

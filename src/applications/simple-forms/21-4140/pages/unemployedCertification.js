import {
  titleUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Unemployed'),
    certifyNoEmployment: yesNoUI({
      title: 'Do you certify that you have no employment to report?',
      hint: `I CERTIFY THAT I have not been employed by the VA, other employers or self-employed during the past twelve months.

I FURTHER CERTIFY THAT the items completed on this form are true and correct to the best of my knowledge and belief. I believe that my service-connected disability(ies) has not improved and continues to prevent me from securing or following gainful employment.`,
      errorMessages: {
        required: 'Select if yes to continue',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      certifyNoEmployment: yesNoSchema,
    },
    required: ['certifyNoEmployment'],
  },
};

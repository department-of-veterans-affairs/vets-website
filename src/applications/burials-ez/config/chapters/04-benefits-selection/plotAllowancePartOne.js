import {
  currencyUI,
  currencyStringSchema,
  titleUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    ...titleUI('Plot or interment allowance'),
    govtContributions: yesNoUI(
      'Did the federal government, state government, or the Veteran’s employer pay any of the burial costs?',
    ),
    amountGovtContribution: {
      ...currencyUI({
        title: 'Amount the government or employer paid',
        hideIf: form => !form?.govtContributions,
        errorMessages: {
          pattern:
            'You entered a character we can\'t accept. Remove symbols or special characters like "$," commas, or periods.',
        },
        min: 0,
      }),
      'ui:required': form => form?.govtContributions,
    },
  },
  schema: {
    type: 'object',
    required: ['govtContributions'],
    properties: {
      govtContributions: yesNoSchema,
      amountGovtContribution: currencyStringSchema,
    },
  },
};

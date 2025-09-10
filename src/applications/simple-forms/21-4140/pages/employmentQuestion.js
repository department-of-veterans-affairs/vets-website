import {
  titleUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      'Have you had any employment in the past 12 months?',
      "This includes working for the VA, other employers, or being self-employed. If yes, you'll need to add at least one employer. You can add up to 4.",
    ),
    hasEmployment: yesNoUI({
      title: 'Have you had any employment in the past 12 months?',
      hint:
        "This includes working for the VA, other employers, or being self-employed. If yes, you'll need to add at least one employer. You can add up to 4.",
      errorMessages: {
        required: 'Select if you have employment to report.',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      hasEmployment: yesNoSchema,
    },
    required: ['hasEmployment'],
  },
};

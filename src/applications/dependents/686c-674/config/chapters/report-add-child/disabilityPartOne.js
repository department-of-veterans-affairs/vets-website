import {
  arrayBuilderItemSubsequentPageTitleUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export const disabilityPartOne = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) =>
        `${formData?.fullName?.first || 'Child'}'s disability status`,
      null,
      false,
    ),

    doesChildHaveDisability: yesNoUI({
      title: 'Does this child have a permanent mental or physical disability?',
      required: () => true,
      errorMessages: {
        required: 'You must answer this question.',
      },
    }),
  },
  schema: {
    type: 'object',
    required: ['doesChildHaveDisability'],
    properties: {
      doesChildHaveDisability: yesNoSchema,
    },
  },
};

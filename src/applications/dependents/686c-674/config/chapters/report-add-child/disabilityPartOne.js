import {
  titleUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export const disabilityPartOne = {
  uiSchema: {
    ...titleUI('Child’s disability status'),

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

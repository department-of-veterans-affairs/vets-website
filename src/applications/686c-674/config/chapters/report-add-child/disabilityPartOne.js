import {
  titleUI,
  yesNoUI,
  yesNoSchema,
} from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';

export const disabilityPartOne = {
  uiSchema: {
    ...titleUI('Child’s disability'),

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
    properties: {
      doesChildHaveDisability: yesNoSchema,
    },
  },
};

import {
  titleUI,
  yesNoUI,
  yesNoSchema,
} from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';

export const relationshipPartOne = {
  uiSchema: {
    ...titleUI({
      title: 'Your relationship to this child',
    }),
    isBiologicalChild: yesNoUI({
      title: 'Is this child your biological child?',
      required: () => true,
      errorMessages: {
        required: 'Select Yes or No.',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      isBiologicalChild: yesNoSchema,
    },
  },
};

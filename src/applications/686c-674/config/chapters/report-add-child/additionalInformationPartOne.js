import {
  titleUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export const additionalInformationPartOne = {
  uiSchema: {
    ...titleUI('Additional information about this child'),

    doesChildLiveWithYou: yesNoUI({
      title: 'Does this child live with you?',
      required: () => true,
      errorMessages: {
        required: 'You must answer this question.',
      },
    }),

    hasChildEverBeenMarried: yesNoUI({
      title: 'Has this child ever been married?',
      required: () => true,
      errorMessages: {
        required: 'You must answer this question.',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      doesChildLiveWithYou: yesNoSchema,
      hasChildEverBeenMarried: yesNoSchema,
    },
  },
};

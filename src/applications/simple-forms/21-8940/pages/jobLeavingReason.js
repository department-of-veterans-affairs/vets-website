// @ts-check
import {
  titleUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Leaving work due to disability'),
    leftJobDueToDisability: yesNoUI({
      title:
        'Did you leave your last job or self-employment because of your disability?',
      descriptions: {
        Y: 'If yes, provide an explanation',
      },
      errorMessages: {
        required:
          'Select if you left your last job or self-employment because of your disability',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      leftJobDueToDisability: yesNoSchema,
    },
    required: ['leftJobDueToDisability'],
  },
};

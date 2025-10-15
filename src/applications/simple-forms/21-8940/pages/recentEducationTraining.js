import {
  titleUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Post-disability training'),
    recentEducationTraining: yesNoUI({
      title:
        'Have you had any education or training since your disability prevented you from working?',
      errorMessages: {
        required:
          'Select if you have had education or training since becoming disabled',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      recentEducationTraining: yesNoSchema,
    },
    required: ['recentEducationTraining'],
  },
};

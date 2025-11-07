import {
  titleUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Pre-disability training'),
    pastEducationTraining: yesNoUI({
      title:
        'Did you have any other education or training before your disability prevented you from working?',
      errorMessages: {
        required:
          'Select if you had additional education or training before your disability prevented you from working',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      pastEducationTraining: yesNoSchema,
    },
    required: ['pastEducationTraining'],
  },
};

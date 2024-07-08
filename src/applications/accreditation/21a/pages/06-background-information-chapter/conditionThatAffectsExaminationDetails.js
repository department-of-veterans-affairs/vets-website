import {
  textareaSchema,
  textareaUI,
} from '~/platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  title: 'Condition that affects examination details',
  path: 'condition-that-affects-examination-details',
  depends: formData => formData.conditionThatAffectsExamination,
  uiSchema: {
    conditionThatAffectsExaminationDetails: textareaUI({
      title:
        'Please state the nature of such limitations and provide details of any special accommodations deemed necessary.',
      labelHeaderLevel: '3', // TODO: Fix labelHeaderLevel for Textarea
    }),
  },
  schema: {
    type: 'object',
    properties: {
      conditionThatAffectsExaminationDetails: textareaSchema,
    },
    required: ['conditionThatAffectsExaminationDetails'],
  },
};

import {
  textareaSchema,
  textareaUI,
  titleUI,
} from '~/platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  title: 'Condition that affects examination details',
  path: 'condition-that-affects-examination-details',
  depends: formData => formData.conditionThatAffectsExamination,
  uiSchema: {
    ...titleUI(
      'Please state the nature of such limitations and provide details of any special accommodations deemed necessary.',
    ),
    conditionThatAffectsExaminationDetails: textareaUI(' '),
  },
  schema: {
    type: 'object',
    properties: {
      conditionThatAffectsExaminationDetails: textareaSchema,
    },
    required: ['conditionThatAffectsExaminationDetails'],
  },
};

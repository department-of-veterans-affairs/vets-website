import {
  textareaSchema,
  textareaUI,
} from '~/platform/forms-system/src/js/web-component-patterns';

import ConditionThatAffectsRepresentationDetailsNote from '../../components/ConditionThatAffectsRepresentationDetailsNote';

/** @type {PageSchema} */
export default {
  title: 'Condition that affects representation details',
  path: 'condition-that-affects-representation-details',
  depends: formData => formData.conditionThatAffectsRepresentation,
  uiSchema: {
    conditionThatAffectsRepresentationDetails: textareaUI({
      title:
        'Describe the condition or impairment and any treatment you receive now or in the past year',
      labelHeaderLevel: '3', // TODO: Fix labelHeaderLevel for Textarea
      description: ConditionThatAffectsRepresentationDetailsNote,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      conditionThatAffectsRepresentationDetails: textareaSchema,
    },
    required: ['conditionThatAffectsRepresentationDetails'],
  },
};

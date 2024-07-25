import {
  textareaSchema,
  textareaUI,
} from '~/platform/forms-system/src/js/web-component-patterns';

import ConditionThatAffectsRepresentationDetailsNote from '../../components/06-background-information-chapter/ConditionThatAffectsRepresentationDetailsNote';

/** @type {PageSchema} */
export default {
  title: 'Condition that affects representation details',
  path: 'condition-that-affects-representation-details',
  depends: formData => formData.conditionThatAffectsRepresentation,
  uiSchema: {
    conditionThatAffectsRepresentationDetails: textareaUI({
      title:
        'Describe the condition or impairment and any treatment you receive now or in the past year',
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

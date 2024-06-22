import {
  textareaSchema,
  textareaUI,
  titleUI,
} from '~/platform/forms-system/src/js/web-component-patterns';

import ConditionThatAffectsRepresentationDetailsNote from '../../components/ConditionThatAffectsRepresentationDetailsNote';

/** @type {PageSchema} */
export default {
  title: 'Condition that affects representation details',
  path: 'condition-that-affects-representation-details',
  depends: formData => formData.conditionThatAffectsRepresentation,
  uiSchema: {
    ...titleUI(
      'Describe the condition or impairment and any treatment you receive now or in the past year',
    ),
    conditionThatAffectsRepresentationDetails: textareaUI(' '),
    'view:conditionThatAffectsRepresentationDetailsNote': {
      'ui:description': ConditionThatAffectsRepresentationDetailsNote,
    },
  },
  schema: {
    type: 'object',
    properties: {
      conditionThatAffectsRepresentationDetails: textareaSchema,
      'view:conditionThatAffectsRepresentationDetailsNote': {
        type: 'object',
        properties: {},
      },
    },
    required: ['conditionThatAffectsRepresentationDetails'],
  },
};

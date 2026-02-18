import {
  radioSchema,
  radioUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { separationReasonOptions } from '../../../utils/labels';

/** @type {PageSchema} */
export default {
  title: 'Reason for separation',
  path: 'household/reason-for-separation',
  depends: formData => formData.livedContinuouslyWithVeteran === false,
  uiSchema: {
    ...titleUI('Reason for separation'),
    separationDueToAssignedReasons: radioUI({
      title: 'What was the reason for separation?',
      labels: separationReasonOptions,
    }),
  },
  schema: {
    type: 'object',
    required: ['separationDueToAssignedReasons'],
    properties: {
      separationDueToAssignedReasons: radioSchema(
        Object.keys(separationReasonOptions),
      ),
    },
  },
};

/**
 * @module pages/posture
 * @description Standard form system configuration for Posture page
 * VA Form 21-2680 - House Bound Status (Medical Professional)
 *
 * Collects a description of the patient's posture and general appearance.
 */

import { textareaUI } from 'platform/forms-system/src/js/web-component-patterns';

/**
 * uiSchema for Posture page
 * Textarea for describing posture and general appearance
 */
export const postureUiSchema = {
  'ui:title': 'Posture',
  posture: textareaUI({
    title: 'What is the posture and general appearance of the patient?',
    hint: 'Describe',
    errorMessages: {
      required: 'A description of posture is required',
    },
  }),
};

/**
 * JSON Schema for Posture page
 * Validates posture description
 */
export const postureSchema = {
  type: 'object',
  required: ['posture'],
  properties: {
    posture: { type: 'string' },
  },
};

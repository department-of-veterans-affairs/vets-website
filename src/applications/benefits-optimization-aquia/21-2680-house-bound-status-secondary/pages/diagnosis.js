/**
 * @module pages/diagnosis
 * @description Standard form system configuration for Diagnosis page
 * VA Form 21-2680 - House Bound Status (Medical Professional)
 */

import { textareaUI } from 'platform/forms-system/src/js/web-component-patterns';

/**
 * uiSchema for Diagnosis page
 * Collects a complete diagnosis with significant symptoms for each condition
 */
export const diagnosisUiSchema = {
  'ui:title': 'Diagnosis',
  diagnosis: textareaUI({
    title:
      'Provide a complete diagnosis with the most significant symptoms for each condition.',
    hint:
      'The diagnosis needs to equate to the level of assistance described in the rest of the form.',
    charcount: true,
    maxlength: 1000,
    errorMessages: {
      required: 'Diagnosis information is required',
      maxLength: 'Diagnosis must be 1000 characters or less',
    },
  }),
};

/**
 * JSON Schema for Diagnosis page
 * Validates diagnosis text field (max 1000 characters)
 */
export const diagnosisSchema = {
  type: 'object',
  required: ['diagnosis'],
  properties: {
    diagnosis: { type: 'string', maxLength: 1000 },
  },
};

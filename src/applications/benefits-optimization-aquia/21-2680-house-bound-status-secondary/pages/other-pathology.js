/**
 * @module pages/other-pathology
 * @description Standard form system configuration for Other Pathology page
 * VA Form 21-2680 - House Bound Status (Medical Professional)
 *
 * Collects a description of all other pathology affecting the patient.
 */

import { textareaUI } from 'platform/forms-system/src/js/web-component-patterns';

/**
 * uiSchema for Other Pathology page
 * Textarea for describing other pathology
 */
export const otherPathologyUiSchema = {
  'ui:title': 'Other pathology',
  otherPathology: textareaUI({
    title:
      'Describe all other pathology including the loss of bowel or bladder control or the effects of advancing age: such as dizziness, loss of memory or poor balance, that affects the patient\u2019s ability to perform self-care, or if hospitalized, beyond the ward or clinical area.',
    errorMessages: {
      required: 'A description of other pathology is required',
    },
  }),
};

/**
 * JSON Schema for Other Pathology page
 * Validates other pathology description
 */
export const otherPathologySchema = {
  type: 'object',
  required: ['otherPathology'],
  properties: {
    otherPathology: { type: 'string' },
  },
};

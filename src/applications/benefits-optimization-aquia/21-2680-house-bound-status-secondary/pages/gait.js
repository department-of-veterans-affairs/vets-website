/**
 * @module pages/gait
 * @description Standard form system configuration for Gait page
 * VA Form 21-2680 - House Bound Status (Medical Professional)
 */

import { textareaUI } from 'platform/forms-system/src/js/web-component-patterns';

/**
 * uiSchema for Gait page
 * Collects information about the claimant's gait and ambulation
 */
export const gaitUiSchema = {
  gait: textareaUI({
    title: 'Gait',
    labelHeaderLevel: '3',
    errorMessages: {
      required: 'Gait information is required',
    },
  }),
};

/**
 * JSON Schema for Gait page
 * Validates the gait text field
 */
export const gaitSchema = {
  type: 'object',
  required: ['gait'],
  properties: {
    gait: { type: 'string' },
  },
};

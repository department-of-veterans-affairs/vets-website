/**
 * @module pages/nutrition
 * @description Standard form system configuration for Nutrition page
 * VA Form 21-2680 - House Bound Status (Medical Professional)
 */

import { textareaUI } from 'platform/forms-system/src/js/web-component-patterns';

/**
 * uiSchema for Nutrition page
 * Collects information about the claimant's nutritional status
 */
export const nutritionUiSchema = {
  nutrition: textareaUI({
    title: 'Nutrition',
    labelHeaderLevel: '3',
    errorMessages: {
      required: 'Nutrition information is required',
    },
  }),
};

/**
 * JSON Schema for Nutrition page
 * Validates the nutrition text field
 */
export const nutritionSchema = {
  type: 'object',
  required: ['nutrition'],
  properties: {
    nutrition: { type: 'string' },
  },
};

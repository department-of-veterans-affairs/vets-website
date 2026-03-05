/**
 * @module pages/blindness
 * @description Standard form system configuration for Blindness page
 * VA Form 21-2680 - House Bound Status (Medical Professional)
 *
 * Collects legal blindness status via Yes/No radio.
 * If "Yes", the next page (blindness-details) is shown.
 * If "No", skips to the nursing home question.
 */

import {
  yesNoUI,
  yesNoSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/**
 * uiSchema for Blindness page
 * Yes/No radio only
 */
export const blindnessUiSchema = {
  ...titleUI('Blindness'),
  isLegallyBlind: yesNoUI({
    title: 'Is the patient legally blind?',
    required: () => true,
    errorMessages: {
      required: 'Please select yes or no',
    },
  }),
};

/**
 * JSON Schema for Blindness page
 * Validates legal blindness selection
 */
export const blindnessSchema = {
  type: 'object',
  required: ['isLegallyBlind'],
  properties: {
    isLegallyBlind: yesNoSchema,
  },
};

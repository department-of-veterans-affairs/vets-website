/**
 * @module config/form/pages/claimant-question
 * @description Standard form system configuration for Patient Type page
 * VA Form 21-0779 - Request for Nursing Home Information in Connection with Claim for Aid and Attendance
 */

import {
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/**
 * uiSchema for Patient Type page
 * Determines the patient's relationship to the veteran
 * patientType is not actually of the .pdf form currently but it
 * is data that is relevant to the people working the claim - so when automation is introduced we should include it.
 */
export const claimantQuestionUiSchema = {
  claimantQuestion: {
    patientType: radioUI({
      title: 'Who is the patient in the nursing home facility?',
      labels: {
        veteran: 'A Veteran',
        spouse: "A Veteran's spouse",
        parent: "A Veteran's parent",
        child: "A Veteran's child",
      },
      errorMessages: {
        required: 'Please select a relationship to the Veteran',
      },
    }),
  },
};

/**
 * JSON Schema for Patient Type page
 * Validates patient type selection
 */
export const claimantQuestionSchema = {
  type: 'object',
  required: ['claimantQuestion'],
  properties: {
    claimantQuestion: {
      type: 'object',
      required: ['patientType'],
      properties: {
        patientType: radioSchema(['veteran', 'spouse', 'parent', 'child']),
      },
    },
  },
};

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
 * Determines if the patient is a veteran or spouse/parent of a veteran
 */
export const claimantQuestionUiSchema = {
  claimantQuestion: {
    patientType: radioUI({
      title: 'Who is the patient in the nursing home facility?',
      labels: {
        veteran: 'A Veteran',
        spouseOrParent: 'The spouse or parent of a Veteran',
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
        patientType: radioSchema(['veteran', 'spouseOrParent']),
      },
    },
  },
};

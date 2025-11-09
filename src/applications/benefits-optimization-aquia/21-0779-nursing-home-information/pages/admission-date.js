/**
 * @module config/form/pages/admission-date
 * @description Standard form system configuration for Admission Date page
 * VA Form 21-0779 - Request for Nursing Home Information in Connection with Claim for Aid and Attendance
 */

import {
  currentOrPastDateUI,
  currentOrPastDateSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/**
 * uiSchema for Admission Date page
 * Collects the date patient was admitted to nursing home
 */
export const admissionDateUiSchema = {
  admissionDate: {
    admissionDate: currentOrPastDateUI({
      title: 'When was the patient admitted to the nursing home?',
    }),
  },
};

/**
 * JSON Schema for Admission Date page
 * Validates admission date
 */
export const admissionDateSchema = {
  type: 'object',
  required: ['admissionDate'],
  properties: {
    admissionDate: {
      type: 'object',
      required: ['admissionDate'],
      properties: {
        admissionDate: currentOrPastDateSchema,
      },
    },
  },
};
